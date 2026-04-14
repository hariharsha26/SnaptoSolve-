/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import { auth, onSnapshot, collection, db, query, orderBy, handleFirestoreError, OperationType } from "./services/firebase";
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
  const { theme, setUser, user, complaints, addComplaint } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          points: 1250, // Mock initial points
          rank: "Civic Guardian",
        });
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

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-canvas flex justify-center">
        <div className="w-full max-w-md bg-canvas relative flex flex-col shadow-2xl overflow-hidden">
          <Router>
            <div className="flex-1 overflow-y-auto pb-24">
              <Routes>
                <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
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
    </div>
  );
}
