import { useState, useRef } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const refs = useRef([]);

  const faqData = [
    { q: "3D dosyamı nasıl yüklerim?", a: "Teklif bölümündeki dosya alanına STL dosyanızı sürükleyip bırakın veya tıklayıp seçin. Dosya yüklenir yüklenmez model önizleme ve hesaplama başlar." },
    { q: "Fiyat nasıl hesaplanır?", a: "Model geometrisi analiz edilerek duvar/top-alt ve iç doluluk hacimleri tahmin edilir; malzemeye göre yoğunlukla ağırlık bulunur ve gram fiyatı ile çarpılır." },
    { q: "Hangi malzemeler?", a: "PLA, Silk PLA, PETG, ABS, ASA ve TPU başlıca seçeneklerimizdir. Dış ortam ve UV dayanım için ASA; esneklik için TPU önerilir." },
    { q: "Üretim ve kargo süresi ne kadar sürer?", a: "Siparişe göre değişmekle birlikte genellikle 1–3 iş günü içinde üretip kargoya veriyoruz. Acil ihtiyaçlar için bizimle iletişime geçin." },
    { q: "Dosyam yüklenmiyor / Dosya boyutu çok fazla diyor, ne yapmalıyım? ", a: "STL dosyasını yeniden dışa aktarın (binary STL), üçgen sayısını makul tutun ve dosya adında Türkçe/özel karakter kullanmayın." },
  ];

  const toggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Nasıl yardımcı olabiliriz?</h2>

      {faqData.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`faq-item ${isOpen ? "open" : ""}`}
            onClick={() => toggle(index)}
          >
            <div className="faq-question">
              {item.q}
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </div>

            {/* height ölçümü */}
            <div
              ref={(el) => (refs.current[index] = el)}
              className="faq-answer-wrapper"
              style={{
                height: isOpen ? refs.current[index]?.scrollHeight : 0,
              }}
            >
              <div className="faq-answer">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
