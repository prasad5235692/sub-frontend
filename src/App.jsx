import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND =
  process.env.REACT_APP_BACKEND_URL ||
  "https://subscribe-backend-2.onrender.com";

export default function DarkSubscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isEmailValid, setIsEmailValid] = useState(true);

  // Auto-hide toast
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // Email validator
  function isValidEmail(v = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());
  }

  async function handleEmailSubscribe() {
    if (!email || !isValidEmail(email)) {
      setIsEmailValid(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessageType("success");
        setMessage("You are successfully subscribed 🎉");
        setEmail(""); // clear input
      } else {
        setMessageType("error");
        setMessage("Error: " + (data.msg || JSON.stringify(data)));
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Network error: " + err.message);
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(120deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      {/* Background animation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "repeating-conic-gradient(#0d1117 0% 10%, #111213ff 10% 20%)",
          opacity: 0.08,
          animation: "rotate 20s linear infinite",
          zIndex: 0,
        }}
      />
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Toast */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                marginBottom: 10,
                padding: "14px 20px",
                borderRadius: 12,
                border: `1px solid ${
                  messageType === "success"
                    ? "#3fb950"
                    : messageType === "error"
                    ? "#ff416c"
                    : "#58a6ff"
                }`,
                background: "rgba(24,26,35,0.95)",
                color:
                  messageType === "success"
                    ? "#3fb950"
                    : messageType === "error"
                    ? "#ff416c"
                    : "#58a6ff",
                fontSize: 14,
                fontWeight: 600,
                minWidth: 200,
                boxShadow:
                  messageType === "success"
                    ? "0 0 15px rgba(63,185,80,0.6)"
                    : messageType === "error"
                    ? "0 0 15px rgba(255,65,108,0.6)"
                    : "0 0 15px rgba(88,166,255,0.5)",
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card (Only Email Form) */}
      <motion.div
        style={{
          position: "relative",
          background: "rgba(24,26,35,0.9)",
          padding: 40,
          borderRadius: 20,
          width: 420,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.7), 0 0 25px rgba(88,166,255,0.4) inset",
          border: "1px solid rgba(88,166,255,0.5)",
          textAlign: "center",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailValid(isValidEmail(e.target.value));
          }}
          placeholder="Enter your mail"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: `1px solid ${isEmailValid ? "#58a6ff" : "#ff416c"}`,
            background: "#0d1117",
            color: "#fff",
            outline: "none",
            width: "100%",
            boxShadow: isEmailValid
              ? "inset 0 0 10px rgba(88,166,255,0.2)"
              : "inset 0 0 10px rgba(255,65,108,0.3)",
          }}
        />
        {!isEmailValid && (
          <p
            style={{
              color: "#ff416c",
              fontSize: 12,
              marginTop: 4,
              textAlign: "left",
              width: "100%",
            }}
          >
            Please enter a valid mail address.
          </p>
        )}
        <motion.button
          onClick={handleEmailSubscribe}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 20,
            padding: "14px 32px",
            fontSize: 16,
            borderRadius: 20,
            border: "2px solid #58a6ff",
            background: "linear-gradient(90deg, #0d1117, #161b22)",
            color: "#58a6ff",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:
              "0 0 25px rgba(88,166,255,0.6), inset 0 0 10px rgba(88,166,255,0.3)",
          }}
        >
          Subscribe
        </motion.button>
      </motion.div>
    </div>
  );
}
