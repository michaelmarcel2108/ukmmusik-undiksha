"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] min-w-[320px]"
        >
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            type === "success" 
              ? "bg-green-50 text-green-900 border-green-200" 
              : "bg-red-50 text-red-900 border-red-200"
          }`}>
            {type === "success" ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <p className="font-semibold flex-1">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
