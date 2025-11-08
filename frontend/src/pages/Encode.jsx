// src/pages/EncodePage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaImage, FaLock } from "react-icons/fa";
import axios from "axios";

export default function EncodePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const handleEncode = async (e) => {
    e.preventDefault();
    if (!file || !message) return alert("Please select an image and enter message");
    setLoading(true);

    const form = new FormData();
    form.append("image", file);
    form.append("message", message);

    try {
      const res = await axios.post(`${API}/encode`, form, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setResultUrl(url);
    } catch (error) {
      alert("Error encoding image");
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
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-gray-700/20 rounded-full blur-3xl bottom-0 right-10"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-xl z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaLock className="text-3xl text-red-500" />
          <h2 className="text-3xl font-bold">Encode Message</h2>
        </div>

        <form onSubmit={handleEncode} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Choose Image (PNG)</label>
            <input
              type="file"
              accept=".png,.bmp"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer p-2"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Secret Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 resize-none"
              rows="4"
              placeholder="Type your secret message..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-lg"
          >
            {loading ? "Encoding..." : "Encode & Download"}
          </motion.button>
        </form>

        {resultUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 mb-3">✅ Encoded Image Ready</p>
            <img
              src={resultUrl}
              alt="stego"
              className="mx-auto rounded-lg border border-gray-700"
            />
            <a
              href={resultUrl}
              download="encoded.png"
              className="inline-block mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
            >
              Download Image
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
