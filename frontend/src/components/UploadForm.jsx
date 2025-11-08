// src/components/UploadForm.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiRefreshCw, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function UploadForm() {
  const [mode, setMode] = useState('encode'); // encode or decode
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [stegoUrl, setStegoUrl] = useState(null);
  const [origUrl, setOrigUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  // Estimate capacity (bytes) from image file (client-side)
  const estimateCapacity = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const bits = img.width * img.height * 3;
        const bytes = Math.floor(bits / 8);
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height, bits, bytes, approxChars: Math.floor(bytes) });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setResultMsg('');
    setStegoUrl(null);
    if (f) {
      const oUrl = URL.createObjectURL(f);
      setOrigUrl(oUrl);
      const cap = await estimateCapacity(f);
      if (cap) {
        // small UX: show capacity in result area
        setResultMsg(`Image: ${cap.width}×${cap.height} — capacity ≈ ${Math.floor(cap.bytes)} bytes`);
      }
    } else {
      setOrigUrl(null);
    }
  };

  const handleEncode = async (e) => {
    e.preventDefault();
    if (!file || !message) return toast.error("Select PNG and enter a message.");
    setLoading(true);

    // client-side capacity warning
    const cap = await estimateCapacity(file);
    if (cap && message.length > cap.approxChars - 16) {
      // -16 roughly for delimiter + safety
      toast.error(`Message may be too large for this image (≈ ${cap.approxChars} chars).`);
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append('image', file);
    form.append('message', message);

    const t = toast.loading('Encoding image...');
    try {
      const res = await axios.post(`${API}/encode`, form, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setStegoUrl(url);
      setResultMsg("Encoded successfully — download below");
      toast.success('Encoded successfully');
    } catch (err) {
      const errMsg = err?.response?.data?.error || err.message;
      setResultMsg("Error: " + errMsg);
      toast.error(errMsg);
    } finally {
      toast.dismiss(t);
      setLoading(false);
    }
  };

  const handleDecode = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select PNG/BMP to decode");
    setLoading(true);
    setResultMsg('');
    const form = new FormData();
    form.append('image', file);
    const t = toast.loading('Decoding image...');
    try {
      const res = await axios.post(`${API}/decode`, form);
      setResultMsg(res.data.message || "No hidden message found");
      toast.success('Decoded');
    } catch (err) {
      const errMsg = err?.response?.data?.error || err.message;
      setResultMsg("Error: " + errMsg);
      toast.error(errMsg);
    } finally {
      toast.dismiss(t);
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setMessage('');
    setResultMsg('');
    setStegoUrl(null);
    setOrigUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} className="card max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">LSB Image Steganography</h2>
          <div className="flex gap-2">
            <button onClick={() => setMode('encode')} className={`px-3 py-1 rounded ${mode==='encode' ? 'bg-red-600 text-white' : 'bg-white'}`}>Encode</button>
            <button onClick={() => setMode('decode')} className={`px-3 py-1 rounded ${mode==='decode' ? 'bg-red-600 text-white' : 'bg-white'}`}>Decode</button>
          </div>
        </div>

        <form onSubmit={mode==='encode' ? handleEncode : handleDecode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Choose Image (PNG/BMP)</label>
            <input ref={fileRef} type="file" accept=".png,.bmp" onChange={handleFileChange} className="mt-2" />
          </div>

          {mode === 'encode' && (
            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5}
                className="w-full mt-2 p-2 rounded border" placeholder="Enter secret message..." />
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Processing...' : (mode==='encode' ? <><FiUpload/> Encode & Download</> : <><FiUpload/> Decode</>)}
            </button>

            <button type="button" onClick={resetAll} className="btn-ghost">
              <FiRefreshCw /> Reset
            </button>

            {stegoUrl && (
              <a href={stegoUrl} download="stego.png" className="btn-ghost ml-auto">
                <FiDownload/> Download Stego
              </a>
            )}
          </div>
        </form>

        {/* previews and compare */}
        {origUrl && stegoUrl ? (
          <div className="mt-6">
            <p className="font-medium mb-3">Compare Original ↔ Stego</p>
            <div className="rounded-lg overflow-hidden">
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={origUrl} alt="original" />}
                itemTwo={<ReactCompareSliderImage src={stegoUrl} alt="stego" />}
              />
            </div>
          </div>
        ) : origUrl && !stegoUrl ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Original</p>
              <img src={origUrl} alt="original" className="preview-img mt-2" />
            </div>
          </div>
        ) : null}

        {resultMsg && <div className="result-box">{resultMsg}</div>}
      </motion.div>
    </>
  );
}
