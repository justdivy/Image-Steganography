// src/pages/DecodePage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUnlockAlt, FaImage } from "react-icons/fa";
import axios from "axios";

export default function DecodePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const handleDecode = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image to decode");
    setLoading(true);

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(`${API}/decode`, form);
      setMessage(res.data.message || "No hidden message found!");
    } catch (err) {
      alert("Error decoding image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Floating background shapes */}
      <motion.div
        className="absolute w-80 h-80 bg-gray-700/20 rounded-full blur-3xl top-0 left-10"
        animate={{ y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-gray-700/20 rounded-full blur-3xl bottom-0 right-10"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 11 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-xl z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaUnlockAlt className="text-3xl text-blue-400" />
          <h2 className="text-3xl font-bold">Decode Message</h2>
        </div>

        <form onSubmit={handleDecode} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Choose Image (PNG)</label>
            <input
              type="file"
              accept=".png,.bmp"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer p-2"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-lg"
          >
            {loading ? "Decoding..." : "Decode Image"}
          </motion.button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 text-center"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Decoded Message:</h3>
            <p className="text-gray-200">{message}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
