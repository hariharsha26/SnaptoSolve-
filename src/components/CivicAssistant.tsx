import React, { useState, useRef, useEffect } from "react";
import { NeuCard } from "./NeuCard";
import { NeuButton } from "./NeuButton";
import { NeuInput } from "./NeuInput";
import { ChatCircle, X, PaperPlaneRight, Robot, User } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { getCivicAssistantResponse } from "../services/geminiService";

export const CivicAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! I'm your Civic Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getCivicAssistantResponse(input, history);
    setMessages(prev => [...prev, { role: "model", text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-28 right-6 z-[100]">
        <NeuButton
          variant="primary"
          className="w-14 h-14 rounded-2xl shadow-primary/40"
          onClick={() => setIsOpen(true)}
        >
          <ChatCircle size={28} weight="fill" />
        </NeuButton>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-24 top-20 z-[110] flex flex-col"
          >
            <NeuCard className="flex-1 flex flex-col overflow-hidden border border-primary/10">
              {/* Header */}
              <div className="p-4 border-b border-text-secondary/10 flex justify-between items-center bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white">
                    <Robot size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-title-lg font-bold">Civic Assistant</h3>
                    <p className="text-[10px] text-success font-bold uppercase">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-text-secondary">
                  <X size={24} weight="bold" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      msg.role === "user" ? "bg-primary text-white" : "bg-inset text-primary"
                    )}>
                      {msg.role === "user" ? <User size={16} weight="fill" /> : <Robot size={16} weight="fill" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-body-md",
                      msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-inset text-text-primary rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-inset flex items-center justify-center text-primary">
                      <Robot size={16} weight="fill" />
                    </div>
                    <div className="bg-inset p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-text-secondary/10 flex gap-2">
                <NeuInput
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <NeuButton
                  variant="primary"
                  className="w-12 h-12 rounded-2xl flex-shrink-0"
                  onClick={handleSend}
                  disabled={isLoading}
                >
                  <PaperPlaneRight size={20} weight="fill" />
                </NeuButton>
              </div>
            </NeuCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import { cn } from "../lib/utils";
