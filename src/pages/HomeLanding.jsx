// src/pages/HomeLanding.jsx
import { useEffect, useState } from "react";
import "./HomeLanding.css";
import { useNavigate } from "react-router-dom";

export default function HomeLanding() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Ekran boyutu değişince mobil/masaüstü resmi güncelle
  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Banner yolları
  const banners = {
    left: isMobile
      ? "/banners/landing1-mobile.jpg"
      : "/banners/landing1.jpg",
    middle: isMobile
      ? "/banners/landing2-mobile.jpg"
      : "/banners/landing2.jpg",
    right: isMobile
      ? "/banners/landing3-mobile.jpg"
      : "/banners/landing3.jpg",
  };

  return (
    <div className="hl-wrapper">
      <div className="hl-inner">

        {/* Sol kutu — 3D Baskı Sayfası */}
        <div
          className="hl-box hl-left"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}${banners.left})`,
          }}
          onClick={() => navigate("/3d-baski")}
        />

        {/* Orta kutu — Toptan Satış */}
        <div
          className="hl-box hl-middle"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}${banners.middle})`,
          }}
          onClick={() => navigate("/ToptanSatis")}
        />

        {/* Sağ kutu — Online Mağaza */}
        <div
          className="hl-box hl-right"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}${banners.right})`,
          }}
          onClick={() => navigate("/Magaza")}
        />

      </div>
    </div>
  );
}
