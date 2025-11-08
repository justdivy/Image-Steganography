import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EncodePage from "./pages/Encode.jsx";
import DecodePage from "./pages/Decode.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encode" element={<EncodePage />} />
        <Route path="/decode" element={<DecodePage />} />
      </Routes>
    </BrowserRouter>
  );
}
