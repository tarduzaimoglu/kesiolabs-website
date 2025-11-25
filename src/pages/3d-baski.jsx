import Slider from "react-slick";
import bannerData from "../bannerData";
import "slick-carousel/slick/slick.css"; 
// Removed invalid slick-theme.css import
import { useNavigate } from "react-router-dom";
import "./3d-baski.css";
import FAQ from "../components/FAQ";
import { useEffect, useState } from "react";
import bannerDesktop from "../bannerDataDesktop";
import bannerMobile from "../bannerDataMobile";



// --- CUSTOM ARROWS ---
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-next" onClick={onClick}>
      ❯
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-prev" onClick={onClick}>
      ❮
    </div>
  );
}

export default function AnaSayfa() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => setIsMobile(window.innerWidth < 768);
  checkScreen();
  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);

const bannersToShow = isMobile ? bannerMobile : bannerDesktop;


  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    appendDots: dots => (
      <div>
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),

    customPaging: i => (
      <div className="custom-dot"></div>
    )
  };

  return (
    <div className="main-container">
      
      <Slider {...settings} className="banner-slider">
        {bannersToShow.map(banner => (
          <div 
            key={banner.id} 
            className="banner-slide"
            onClick={() => navigate(banner.link)}
            style={{ cursor: "pointer" }}
          >
            <img src={banner.image} alt={banner.title} className="banner-img"/>
          </div>
        ))}
      </Slider>

      {/* --- BÖYLE ÇALIŞIR ALANI --- */}
      <section className="steps-section">

        <h2 className="steps-title">Böyle Çalışır</h2>
        <p className="steps-subtitle">Sadece üç adımda 3D baskı teklifinizi alın.</p>

        <div className="steps-wrapper">

          <div className="step-box">
            <span className="step-number">1</span>
            <h3>STL dosyasını yükleyin</h3>
            <p>STL dosyanızı yükleyin; model anında önizlemede görünsün ve hesaplamalar başlasın.</p>
          </div>

          <div className="step-box">
            <span className="step-number">2</span>
            <h3>Seçimlerinizi yapın</h3>
            <p>
              Renk, malzeme, iç doluluk ve adedi seçin;
              gram, süre ve fiyat otomatik güncellensin.
            </p>
            <a className="step-link" href="/BoyleCalisir">Malzemelerimize göz atın →</a>
          </div>

          <div className="step-box">
            <span className="step-number">3</span>
            <h3>Onaylayıp üretime geçiyoruz</h3>
            <p>
              Teklifi kaydedin; WhatsApp veya e-posta ile iletin;
              baskı planına alalım.
            </p>
          </div>

        </div>

        <div className="steps-button-area">
          <a className="main-button" href="/TeklifAl">Tasarımımı Üret!</a>
        </div>

      </section>

      {/* --- FAQ BURAYA EKLENDİ --- */}
      <FAQ />
      
      {/* --- KONUM HARİTASI --- */}
<section className="homepage-map-section">

  <h2 className="map-title">
     Merkezimiz
  </h2>

  <p className="map-address">
    <strong>Adres:</strong> İstanbul Maltepe, Fındıklı Mahallesi, Ermiş Sokak No:17
  </p>

  <div className="map-embed-container">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.991770981021!2d29.121982!3d40.936230!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac7497eeb5d97%3A0x54e2b5947f0f4d35!2sErmiş%20Sk.%20No%3A17%2C%2034854%20Maltepe%2Fİstanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

</section>


    </div>
  );
}
