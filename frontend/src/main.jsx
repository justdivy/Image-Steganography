import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Encode from './pages/Encode.jsx'
import Decode from './pages/Decode.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/encode" element={<Encode />} />
      <Route path="/decode" element={<Decode />} />
    </Routes>
  </BrowserRouter>
)
