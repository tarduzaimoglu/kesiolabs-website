// src/pages/BoyleCalisir.jsx
import "./BoyleCalisir.css";

export default function BoyleCalisir() {
  return (
    <div className="bc-wrapper">

      <div className="bc-hero">
        <h1>Böyle Çalışır</h1>
        <p>Kesiolabs ile 3D baskı sipariş süreci hızlı, şeffaf ve tamamen dijital.</p>
      </div>

      {/* --- ADIMLAR --- */}
      <section className="bc-steps">
        
        <div className="bc-step">
          <span className="bc-number">1</span>
          <h2>STL Dosyanızı Yükleyin</h2>
          <p>
            Yüklediğiniz dosya anında 3D önizleme ekranında görüntülenir, model hacmi ve yüzey alanı otomatik olarak hesaplanır. 
          </p>
        </div>

        <div className="bc-step">
          <span className="bc-number">2</span>
          <h2>Seçimlerinizi Yapın</h2>
          <p>
            Malzeme, renk, iç doluluk ve adet gibi tüm üretim parametrelerini seçebilirsiniz. 
            Hesaplama motoru, gram ve fiyat değerlerini anlık olarak günceller.
          </p>
          <a href="/BoyleCalisir" className="bc-link">Malzemelerimize göz atın →</a>
        </div>

        <div className="bc-step">
          <span className="bc-number">3</span>
          <h2>Fiyatlandırmayı İnceleyin</h2>
          <p>
            Hesaplama sonucunda birim fiyat, toplam fiyat ve tahmini gramaj bilgisi görüntülenir. 
            Tüm değerler gerçek baskı prensiplerine göre matematiksel olarak hesaplanır.
          </p>
        </div>

        <div className="bc-step">
          <span className="bc-number">4</span>
          <h2>Siparişi Onaylayın</h2>
          <p>
            Siparişi WhatsApp veya e-posta üzerinden bizimle paylaşın. Müşteri temsilcimiz modeli kontrol ederek üretim 
            için onay sürecini başlatır.
          </p>
        </div>

        <div className="bc-step">
          <span className="bc-number">5</span>
          <h2>Üretim & Teslimat</h2>
          <p>
            Parçanız işleme alındıktan sonra kalite kontrolü yapılır, paketlenir ve adresinize kargolanır.
            Süreç boyunca tarafınıza bilgilendirme yapılır.
          </p>
        </div>

      </section>

      {/* --- ALT CTA --- */}
      <div className="bc-cta">
        <h2>Tasarımınızı üretmeye hazır mısınız?</h2>
        <p>Hemen STL dosyanızı yükleyin ve fiyatınızı anında görün.</p>
        <a href="/TeklifAl" className="bc-button">Teklif Al</a>
      </div>

    </div>
  );
}
