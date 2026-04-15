/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import { auth, onSnapshot, collection, db, query, orderBy, handleFirestoreError, OperationType, getDoc, doc, setDoc, serverTimestamp } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Screens
import Home from "./screens/Home";
import SnapCapture from "./screens/SnapCapture";
import SubmissionForm from "./screens/SubmissionForm";
import Tracking from "./screens/Tracking";
import MapView from "./screens/MapView";
import MyComplaints from "./screens/MyComplaints";
import Rewards from "./screens/Rewards";
import Auth from "./screens/Auth";

// Components
import { GlassDock } from "./components/GlassDock";
import { CivicAssistant } from "./components/CivicAssistant";

export default function App() {
  const { theme, setUser, user, complaints, addComplaint, setIsLoading } = useStore();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch full user doc
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            if (userData.isSuspended) {
              alert("Your account has been suspended.");
              auth.signOut();
              setUser(null);
              return;
            }

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.fullName || firebaseUser.displayName,
              photoURL: userData.profileImage || firebaseUser.photoURL,
              role: userData.role || "citizen",
              isEmailVerified: firebaseUser.emailVerified,
              isSuspended: userData.isSuspended || false,
              isAnonymous: firebaseUser.isAnonymous,
              points: userData.stats?.trustScore || 50,
              rank: "Civic Guardian",
            });

            // Create session
            const sessionId = `${firebaseUser.uid}_${Date.now()}`;
            await setDoc(doc(db, "sessions", sessionId), {
              userId: firebaseUser.uid,
              deviceInfo: navigator.userAgent,
              ipAddress: "client-ip", // In a real app, fetch from an API
              loginTime: serverTimestamp(),
              lastActive: serverTimestamp(),
              isActive: true
            });
          } else {
            // Fallback if doc doesn't exist yet (e.g., during signup)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "citizen",
              isEmailVerified: firebaseUser.emailVerified,
              isSuspended: false,
              isAnonymous: firebaseUser.isAnonymous,
              points: 50,
              rank: "Civic Guardian",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!user) return;

    const path = "complaints";
    const q = query(collection(db, path), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // In a real app, we'd sync the whole list or handle updates
        }
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-canvas flex justify-center text-text-primary font-sans antialiased">
      <div className="w-full max-w-md bg-canvas relative flex flex-col shadow-2xl overflow-hidden">
          <Router>
            <div className="flex-1 overflow-y-auto pb-32 relative">
              <Routes>
                <Route path="/auth" element={!user ? <Auth /> : user.isEmailVerified === false && user.email ? <Navigate to="/verify-email" /> : <Navigate to="/" />} />
                <Route path="/verify-email" element={user && user.isEmailVerified === false && user.email ? <Auth /> : <Navigate to="/" />} />
                <Route path="/" element={user ? (user.isEmailVerified === false && user.email ? <Navigate to="/verify-email" /> : <Home />) : <Navigate to="/auth" />} />
                <Route path="/snap" element={user ? <SnapCapture /> : <Navigate to="/auth" />} />
                <Route path="/submit" element={user ? <SubmissionForm /> : <Navigate to="/auth" />} />
                <Route path="/tracking/:id" element={user ? <Tracking /> : <Navigate to="/auth" />} />
                <Route path="/map" element={user ? <MapView /> : <Navigate to="/auth" />} />
                <Route path="/my-complaints" element={user ? <MyComplaints /> : <Navigate to="/auth" />} />
                <Route path="/rewards" element={user ? <Rewards /> : <Navigate to="/auth" />} />
              </Routes>
            </div>
            {user && <GlassDock />}
            {user && <CivicAssistant />}
          </Router>
        </div>
      </div>
  );
}
