import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import AnaSayfa from "./pages/3d-baski";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import Blog from "./pages/blog";
import TeklifAl from "./pages/TeklifAl";
import BoyleCalisir from "./pages/BoyleCalisir";

import HomeLanding from "./pages/HomeLanding";
import ToptanSatis from "./pages/ToptanSatis";
import Magaza from "./pages/Magaza";

import Navbar from "./Navbar";
import Footer from "./components/Footer";
import "./App.css";

function Layout({ children }) {
  const location = useLocation();

  // 🔵 Sadece yeni giriş sayfasında navbar gizli
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* YENİ ana sayfa */}
          <Route path="/" element={<HomeLanding />} />

          {/* eski ana sayfa -> artık /3d-baski */}
          <Route path="/3d-baski" element={<AnaSayfa />} />

          {/* yeni sayfalar */}
          <Route path="/ToptanSatis" element={<ToptanSatis />} />
          <Route path="/Magaza" element={<Magaza />} />

          {/* mevcut sayfalar */}
          <Route path="/Hakkimizda" element={<Hakkimizda />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/TeklifAl" element={<TeklifAl />} />
          <Route path="/BoyleCalisir" element={<BoyleCalisir />} />
          <Route path="/Iletisim" element={<Iletisim />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
