import React from "react";
import "./Footer.css";
import { FaPhoneAlt, FaClock, FaEnvelope, FaInstagram, FaInfoCircle } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Sütun 1 – Firma */}
        <div className="footer-col">
          <h3>KesioLabs Endüstriyel Tasarım & 3D Printing</h3>
          <p>İstanbul Maltepe, Fındıklı Mahallesi</p>
          <p>Ermiş Sokak No: 17</p>
        </div>

        {/* Sütun 2 – İletişim */}
        <div className="footer-col">
          <h4>İletişim</h4>
          <p><FaPhoneAlt /> +90 533 383 94 38</p>
          <p><FaPhoneAlt /> +90 553 753 8182</p>
          <p><FaEnvelope /> kesiolabs.contact@gmail.com</p>
        </div>

        {/* Sütun 3 – Çalışma Saatleri */}
        <div className="footer-col">
          <h4>Çalışma Saatleri</h4>
          <p><FaClock /> Hafta içi: 08:00 - 20:00</p>
          <p><FaClock /> Cumartesi: 08:00 - 16:00</p>
          <p><FaClock /> Pazar: Kapalı</p>
          <small>Acil durumlarda WhatsApp üzerinden bizimle iletişime geçebilirsiniz.</small>
        </div>

        {/* Sütun 4 – Sosyal Medya / Hakkımızda */}
        <div className="footer-col">
          <h4>Sosyal Medya</h4>
          <p className="footer-social">
            <FaInstagram /> <span>Instagram</span>
          </p>

          <h4 style={{ marginTop: "20px" }}>Hakkımızda</h4>
          <ul className="footer-links">
            <li><FaInfoCircle /> Kurumsal</li>
            <li><FaInfoCircle /> Gizlilik Politikası</li>
            <li><FaInfoCircle /> Teslimat & İade</li>
            <li><FaInfoCircle /> Sık Sorulan Sorular</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 KesioLabs. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
