import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnaSayfa from "./pages/Anasayfa";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import Blog from "./pages/blog";
import TeklifAl from "./pages/TeklifAl";
import BoyleCalisir from "./pages/BoyleCalisir";
import logo from './logo.svg';
import './App.css';
import Navbar from "./Navbar";
import Footer from "./components/Footer";

function App() {
  return (
<Router>
  <Navbar />
    <Routes>

      {/* Ana Sayfa */}
      <Route path="/" element={<AnaSayfa />} />

      {/* Diğer Sayfalar */}
      <Route path="/hakkimizda" element={<Hakkimizda />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/TeklifAl" element={<TeklifAl />} />
      <Route path="/BoyleCalisir" element={<BoyleCalisir />} />
      <Route path="/Iletisim" element={<Iletisim />} />

    </Routes>
    <Footer />
  </Router>
  );
}



export default App;
