import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-gray-100"
      >
        🧠 Image Steganography
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-gray-400 max-w-lg"
      >
        Hide or reveal secret messages inside images using LSB (Least Significant Bit)
        technique — a fun and secure way to communicate!
      </motion.p>

      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/encode")}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-lg font-semibold"
        >
          Encode Message
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/decode")}
          className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl text-lg font-semibold"
        >
          Decode Message
        </motion.button>
      </div>
    </div>
  );
}
