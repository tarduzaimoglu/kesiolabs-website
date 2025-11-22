import React, { useMemo, useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

/* =========================================================
 *  I18N + CURRENCY
 * ======================================================= */
const I18N = {
  tr: {
    language: "Dil",
    navHome: "Ana Sayfa",
    navAbout: "Hakkımızda",
    navHow: "Böyle Çalışır",
    navQuote: "Teklif Al",
    navBlog: "Blog",
    title: "🧊 3D Baskı – Hızlı Teklif",
    heroTitle: "3D Baskı Karşılaştırma Portalı",
    heroSubtitle:
      "Kaliteli parçaları en uygun fiyata. Dünyanın her yerinden üreticileri anlık olarak karşılaştırın — ister 10 TL ister 10.000 TL sipariş verin, gerisini biz hallederiz.",
    blogTitle: 'KesioLabs Blog',
    blogIntro: '3D baskı, malzeme seçimi ve üretim ipuçları için yakında burada içerikler olacak.',
    blogEmpty: 'Henüz eklenmiş bir blog yazısı yok. Çok yakında burada olacağız.',
    backToMain: 'Ana sayfaya dön',
    blogPosts: [],
    cta: "Hemen Teklif Al",

    // About
    aboutTitle: "Hakkımızda",
    aboutSubtitle: "Üretimin geleceğini daha erişilebilir kılıyoruz.",
    aboutP1:
      "kesiolabs, hızlı prototipleme ve düşük hacimli üretimde şeffaf fiyatlandırma ve güvenilir teslimatı merkezine alan bir üretim teknoloji girişimidir. Amacımız; bireylerden KOBİ’lere, kurumsal AR-GE ekiplerine kadar herkesin, 3D baskıya erişimini kolaylaştırmak ve ölçülebilir kalite sunmaktır.",
    aboutP2:
      "Sistemimiz, STL dosyanızı yüklediğiniz anda model geometri verilerini analiz eder; malzeme, doluluk, katman yüksekliği gibi ayarlarla birlikte gram/süre ve fiyatı anlık hesaplar. Böylece, kesiolabs ile sadece ‘teklif’ değil, üretime giden net bir yol haritası elde edersiniz.",

    // How it works
    howTitle: "Böyle Çalışır",
    howSub: "Sadece üç adımda 3D baskı teklifinizi alın.",
    how1Title: "STL dosyasını yükleyin",
    how1Body:
      "STL dosyanızı yükleyin; model anında önizlemede görünsün ve hesaplamalar başlasın.",
    how1Image: "/images/how1.png",
    how2Image: "/images/how2.png",
    how3Image: "/images/how3.png",
    how2Title: "Seçimlerinizi yapın",
    how2Body:
      "Renk, malzeme, iç doluluk ve adedi seçin; gram, süre ve fiyat otomatik güncellensin.",
    how2Link: "Malzemelerimize göz atın",
    how3Title: "Onaylayıp üretime geçiyoruz",
    how3Body:
      "Teklifi kaydedin, WhatsApp veya e-posta ile iletin; baskı planına alalım.",
    howCta: "Hemen Teklif Al",

    // Form
    stl: "STL Dosyası",
    material: "Malzeme",
    brand: "Marka",
    color: "Renk",
    infill: "İç Doluluk (%)",
    qty: "Adet",
    chooseStl: "STL yükleyince model burada görünecek.",
    solidVol: "Katı Hacim",
    effVol: "Efektif Hacim (duvar + üst/alt + infill)",
    weight: "Ağırlık",
    length: "Filament Uzunluğu",
    gprice: "Gram Fiyatı",
    unit: "Birim Fiyat",
    total: "Toplam",
    perPiece: "/ adet",

    // Materials
    materialsTitle: "Profesyonel Malzeme Çeşitliliği",
    m_pla: "PLA",
    m_silk: "Silk PLA",
    m_petg: "PETG",
    m_abs: "ABS",
    m_asa: "ASA",
    m_tpu: "TPU",

    // Detailed material HTML blocks (requested format)
    mdesc: {
      pla: `<b>PLA (Polilaktik Asit)</b>: Kolay basılan, düşük deformasyonlu ve çevre dostu bir termoplastiktir.<br/>
            <b>Avantajlar:</b>
            <ul>
              <li>Düşük büzülme; raft ve kapalı kabin gereksinimi genellikle yoktur.</li>
              <li>Yüksek yüzey kalitesi ve detay doğruluğu; görsel prototipler için idealdir.</li>
              <li>Düşük koku ve geniş renk seçeneği.</li>
            </ul>
            <b>Kullanım Alanları:</b> Sunum/prototip parçaları, maketler, hobi ürünleri, düşük yük altındaki aparatlar.`,
      silk: `<b>Silk PLA</b>: Metalik/parlak görünüm veren, estetik odaklı PLA türevidir.<br/>
             <b>Avantajlar:</b>
             <ul>
               <li>Pürüzsüz ve parlak yüzey; katman çizgilerini görsel olarak maskeleyebilir.</li>
               <li>PLA kadar kolay basım; düşük warping.</li>
               <li>Geniş renk ve efekt (altın, gümüş, bakır) seçenekleri.</li>
             </ul>
             <b>Kullanım Alanları:</b> Dekoratif objeler, vitrinde sergilenecek maketler, hediyelik ve görsel prototipler.`,
      petg: `<b>PETG (Polietilen Tereftalat Glikol)</b>: PLA ile ABS arasında; kimyasal dayanımı ve tok yapısıyla bilinir.<br/>
             <b>Avantajlar:</b>
             <ul>
               <li>İyi darbe dayanımı ve orta-yüksek sıcaklık direnci (70–80°C civarı).</li>
               <li>Düşük koku, gıda kaplarına uygun varyantları bulunur.</li>
               <li>Katmanlar arası iyi yapışma; fonksiyonel parçalara uygun.</li>
             </ul>
             <b>Kullanım Alanları:</b> Fonksiyonel prototipler, bağlantı parçaları, yarı-şeffaf kutular, koruyucu kapaklar.`,
      abs: `<b>ABS (Akrilonitril Bütadien Stiren)</b>: Mekanik dayanımı yüksek, işlenebilir (zımpara, talaşlı) klasik mühendislik plastiği.<br/>
            <b>Avantajlar:</b>
            <ul>
              <li>Yüksek sıcaklık direnci ve darbe dayanımı.</li>
              <li>Sonradan işleme ve asetat/AC vapour smoothing ile yüzey iyileştirme mümkündür.</li>
              <li>Fonksiyonel kullanım için sağlam parçalar üretir.</li>
            </ul>
            <b>Kullanım Alanları:</b> Dayanım gerektiren prototipler, muhafazalar, otomotiv iç trim parçaları, jig & fikstürler.`,
      asa: `<b>ASA (Akrilonitril Stiren Akrilat)</b>: ABS benzeri fakat üstün UV ve hava şartlarına dayanıklı malzeme.<br/>
            <b>Avantajlar:</b>
            <ul>
              <li>Mükemmel UV dayanımı ve renk stabilitesi — dış ortam için idealdir.</li>
              <li>ABS seviyesinde mekanik dayanım, daha iyi hava koşullarına direnç.</li>
              <li>Pürüzsüz yüzey, iyi ölçüsel kararlılık.</li>
            </ul>
            <b>Kullanım Alanları:</b> Dış mekan parçaları, saha ekipmanı muhafazaları, tabela/aksesuar, otomotiv dış aksam prototipleri.`,
      tpu: `<b>TPU (Termoplastik Poliüretan)</b>: Esnek, kauçuğa benzer davranış gösteren elastomer filament.<br/>
            <b>Avantajlar:</b>
            <ul>
              <li>Yüksek elastikiyet, titreşim sönümleme ve aşınma direnci.</li>
              <li>Kırılmaya karşı dayanıklı; darbe emici özellik.</li>
              <li>Kaymaz ve kavrayıcı yüzeyler üretmek kolaydır.</li>
            </ul>
            <b>Kullanım Alanları:</b> Telefon/alet kılıfları, contalar, ayaklar/padler, esnek menteşeler ve tampon parçalar.`,
    },

    // Services
    svcBadge: "Hizmetlerimiz",
    svcTitle: "3D Çözümlerimiz",
    svcSub: "İhtiyacınıza özel 3D hizmetleri",
    svcPrintTitle: "3D Baskı Hizmeti",
    svcPrintDesc:
      "Endüstriyel kalitede FDM ve SLA baskı teknolojileriyle hızlı ve hassas üretim.",
    svcPrintF1: "Yüksek Hassasiyet",
    svcPrintF2: "Hızlı Üretim",
    svcPrintF3: "Uygun Maliyet",
    svcPrintBtn: "Fiyat Hesapla",
    svcModelTitle: "3D Modelleme Hizmeti",
    svcModelDesc:
      "Uzman tasarımcılarımızla fikirlerinizi gerçeğe dönüştürüyoruz.",
    svcModelF1: "Profesyonel Tasarım",
    svcModelF2: "Revizyon Desteği",
    svcModelF3: "Teknik Çizim",
    svcModelBtnWa: "WhatsApp",
    svcModelBtnCall: "Ara",

    // Location
    locTitle: "Merkezimiz",
    locAddressLabel: "Adres",

    // Footer/Brand
    footerBrand: "kesiolabs",
    footerNote: "Tüm Hakları Saklıdır.",

    // Colors tooltip
    colorNames: {
      Siyah: "Siyah",
      Beyaz: "Beyaz",
      Gri: "Gri",
      Kırmızı: "Kırmızı",
      Mavi: "Mavi",
      Altın: "Altın",
      Gümüş: "Gümüş",
      Bakır: "Bakır",
      Şeffaf: "Şeffaf",
    },

    // Extra Info (unchanged list titles etc.)
    extra1Title: "Sizin de bu sorunlar başınıza geliyor mu?",
    extra1Bullets: [
      "Metal veya plastik parçalar çok mu pahalı?",
      "Tedarik süresi 8 haftayı mı buluyor?",
      "Kalıp üretimi bütçenizi mi aşıyor?",
      "Yedek parça artık piyasada bulunamıyor mu?",
      "Makineniz durdu ve acil parça mı gerekiyor?"
    ],
    extra2TitleA: "kesiolabs ile ",
    extra2TitleB: "3D Baskı Avantajları",
    extra2Bullets: [
      "Hızlı ve güvenilir teslimat",
      "Online fiyatlandırma ve sipariş",
      "Her zaman ulaşılabilir destek",
      "Kurulum veya kalıp maliyeti yok",
      "Siparişlerin kolay takibi"
    ],
    extra3Title: "Neden kesiolabs?",
    extra3P:
      "3D baskı, hızlı yedek parça üretimi ve düşük maliyetle çözüm sunan modern bir üretim yöntemidir. kesiolabs olarak, tecrübemiz ve uzmanlığımızla size en uygun çözümü sunmayı hedefliyoruz.",
    extra3QTitle: "Sipariş verirken şu soruları siz de sordunuz mu?",
    extra3QBullets: [
      "Hangi malzeme benim için uygun?",
      "Yüzde kaç doluluk seçmeliyim?",
      "FDM mi SLA mı kullanmalıyım?",
      "Modelimi nasıl doğru tasarlamalıyım?"
    ],

    // FAQ
    faqTitle: "Nasıl yardımcı olabiliriz?",
    faqHint: "En sık sorulan konulara hızlı cevaplar.",
    faqItems: [
      {
        q: "3D dosyamı nasıl yüklerim?",
        a: "Teklif bölümündeki dosya alanına STL dosyanızı sürükleyip bırakın veya tıklayıp seçin. Dosya yüklenir yüklenmez model önizleme ve hesaplama başlar."
      },
      {
        q: "Fiyat nasıl hesaplanır?",
        a: "Model geometrisi analiz edilerek duvar/top-alt ve iç doluluk hacimleri tahmin edilir; malzemeye göre yoğunlukla ağırlık bulunur ve gram fiyatı ile çarpılır."
      },
      {
        q: "Hangi malzemeleri sunuyorsunuz?",
        a: "PLA, Silk PLA, PETG, ABS, ASA ve TPU başlıca seçeneklerimizdir. Dış ortam ve UV dayanım için ASA; esneklik için TPU önerilir."
      },
      {
        q: "Üretim ve kargo ne kadar sürer?",
        a: "Siparişe göre değişmekle birlikte genellikle 1–3 iş günü içinde üretip kargoya veriyoruz. Acil ihtiyaçlar için bizimle iletişime geçin."
      },
      {
        q: "Dosyam yüklenmiyor / çok büyük diyor, ne yapmalıyım?",
        a: "STL dosyasını yeniden dışa aktarın (binary STL), üçgen sayısını makul tutun ve dosya adında Türkçe/özel karakter kullanmayın."
      }
    ],

    // Bottom company info
    company: {
      heading: "İletişim & Çalışma Saatleri",
      emailLabel: "E‑posta",
      phoneLabel: "Telefon",
      addressLabel: "Adres",
      hoursLabel: "Çalışma Saatleri",
      madeIn: "Made in Türkiye"
    }
  },

  de: {
    language: "Sprache",
    navHome: "Startseite",
    navAbout: "Über uns",
    navHow: "Ablauf",
    navQuote: "Angebot",
    navBlog: "Blog",
    title: " 3D-Druck – Schnellangebot",
    heroTitle: "Das 3D-Druckservice-Vergleichsportal",
    heroSubtitle:
      "Vergleichen Sie Hersteller weltweit in Echtzeit. Bestellen Sie Teile in Industriequalität zum günstigsten Preis – egal, ob für 10 € oder 10.000 € – wir kümmern uns um alles.",
    blogTitle: 'KesioLabs Blog',
    blogIntro: 'Bald finden Sie hier Beiträge zu 3D-Druck, Materialwahl und Produktionstipps.',
    blogEmpty: 'Es wurden noch keine Blog-Beiträge hinzugefügt. Wir sind bald hier.',
    backToMain: 'Zur Startseite zurück',
    blogPosts: [],
    cta: "Sofortangebot",

    aboutTitle: "Über uns",
    aboutSubtitle: "Wir machen die Zukunft der Fertigung zugänglicher.",
    aboutP1:
      "kesiolabs ist ein Fertigungs-Tech-Startup mit Fokus auf transparente Preisgestaltung und verlässliche Lieferzeiten in Rapid Prototyping und Kleinserienfertigung.",
    aboutP2:
      "Unser System analysiert Ihre STL-Geometrie und berechnet Gewicht/Zeit/Preis in Echtzeit – basierend auf Material-, Infill- und Layer-Parametern. Mit kesiolabs bekommen Sie mehr als ein Angebot: einen klaren Fahrplan zur Produktion.",

    howTitle: "Und so geht’s",
    howSub: "In nur drei Schritten zu Ihrem 3D-Druck-Angebot.",
    how1Title: "STL-Datei hochladen",
    how1Body:
      "Laden Sie Ihre STL-Datei hoch; das Modell erscheint sofort in der Vorschau und die Berechnung startet.",
    how1Image: "/images/how1.png",
    how2Image: "/images/how2.png",
    how3Image: "/images/how3.png",
    how2Title: "Optionen wählen",
    how2Body:
      "Farbe, Material, Infill und Menge – Gewicht, Zeit und Preis aktualisieren sich automatisch.",
    how2Link: "Zu unseren Materialien",
    how3Title: "Freigeben & Produktion",
    how3Body:
      "Angebot speichern, per WhatsApp/E-Mail senden; wir starten die Fertigung.",
    howCta: "Sofortangebot",

    stl: "STL-Datei",
    material: "Material",
    brand: "Marke",
    color: "Farbe",
    infill: "Füllung (%)",
    qty: "Menge",
    chooseStl: "Das Modell erscheint nach dem STL-Upload.",
    solidVol: "Volumen (solid)",
    effVol: "Eff. Volumen (Wand + Top/Bottom + Infill)",
    weight: "Gewicht",
    length: "Filamentlänge",
    gprice: "Preis pro Gramm",
    unit: "Stückpreis",
    total: "Gesamt",
    perPiece: "/ Stück",

    materialsTitle: "Professionelle Materialvielfalt",
    m_pla: "PLA",
    m_silk: "Silk PLA",
    m_petg: "PETG",
    m_abs: "ABS",
    m_asa: "ASA",
    m_tpu: "TPU",

    mdesc: {
      pla: `<b>PLA (Polylactid)</b>: Einfache Verarbeitung, geringe Verformung, umweltfreundlich.<br/>
            <b>Vorteile:</b>
            <ul>
              <li>Geringes Schrumpfen; meist kein geschlossener Bauraum nötig.</li>
              <li>Sehr gute Oberflächenqualität und Detailtreue.</li>
              <li>Kaum Geruch, große Farbauswahl.</li>
            </ul>
            <b>Einsatzbereiche:</b> Präsentations- und Konzeptmodelle, Architektur-/Messemodelle, Hobbyobjekte.`,
      silk: `<b>Silk PLA</b>: PLA-Variante mit metallisch/glänzender Oberfläche für besonders ästhetische Ergebnisse.<br/>
             <b>Vorteile:</b>
             <ul>
               <li>Sehr glatte und glänzende Oberfläche – kaschiert teils die Schichtlinien.</li>
               <li>Einfacher Druck ähnlich PLA, geringe Verformung.</li>
               <li>Viele Effektfarben (Gold, Silber, Kupfer).</li>
             </ul>
             <b>Einsatzbereiche:</b> Deko-Objekte, Schauvitrinen, Geschenke, visuelle Prototypen.`,
      petg: `<b>PETG</b>: Ausgewogen zwischen PLA und ABS; chemisch resistent und zäh.<br/>
             <b>Vorteile:</b>
             <ul>
               <li>Gute Schlagzähigkeit und erhöhte Temperaturfestigkeit (~70–80°C).</li>
               <li>Geringer Geruch, lebensmitteltaugliche Varianten verfügbar.</li>
               <li>Sehr gute Layerhaftung – geeignet für funktionale Teile.</li>
             </ul>
             <b>Einsatzbereiche:</b> Funktionale Prototypen, Halterungen, Abdeckungen, halbtransparente Gehäuse.`,
      abs: `<b>ABS</b>: Klassischer Konstruktionskunststoff mit hoher Festigkeit; gut nachbearbeitbar.<br/>
            <b>Vorteile:</b>
            <ul>
              <li>Hohe Temperatur- und Schlagfestigkeit.</li>
              <li>Gut schleifbar/fräsbar; Aceton-Dampfglättung möglich.</li>
              <li>Robuste Teile für praxisnahe Tests.</li>
            </ul>
            <b>Einsatzbereiche:</b> Technische Prototypen, Gehäuse, Automotive-Interieur, Vorrichtungen.`,
      asa: `<b>ASA</b>: ABS-ähnlich, jedoch mit hervorragender UV- und Witterungsbeständigkeit.<br/>
            <b>Vorteile:</b>
            <ul>
              <li>Exzellente UV-Stabilität – ideal für den Außeneinsatz.</li>
              <li>Hohe Maßhaltigkeit und gute Oberflächenqualität.</li>
              <li>Mechanische Eigenschaften ähnlich ABS.</li>
            </ul>
            <b>Einsatzbereiche:</b> Outdoor-Komponenten, Gehäuse im Feld, Beschilderung/Zubehör, Außenteile-Prototypen.`,
      tpu: `<b>TPU</b>: Flexibler, gummiartiger Elastomer-Filament.<br/>
            <b>Vorteile:</b>
            <ul>
              <li>Hohe Elastizität, Dämpfung und Abriebfestigkeit.</li>
              <li>Bruchsicher; stoßabsorbierend.</li>
              <li>Griffige/antirutsch Oberflächen realisierbar.</li>
            </ul>
            <b>Einsatzbereiche:</b> Hüllen/Schutzelemente, Dichtungen, Füße/Pads, flexible Scharniere, Pufferteile.`,
    },

    note1: "Hochgeladene Dateien müssen im STL-Format vorliegen.",
    note2:
      "Verfügbare Filamentfarben können variieren; meist sind Schwarz, Grau und Weiß auf Lager. Für andere Farben bitte Kontakt aufnehmen.",
    note3Before: "Der angezeigte Preis nach dem Upload ist",
    noteEmph: "EINE SCHÄTZUNG!",
    note3After:
      "Der Betrag basiert auf Annahmen; je nach Geometrie, Druckzeit und Füllung kann der endgültige Preis niedriger oder höher ausfallen.",

    svcBadge: "Unsere Leistungen",
    svcTitle: "3D Lösungen",
    svcSub: "Individuelle 3D-Services für Ihren Bedarf",
    svcPrintTitle: "3D-Druckservice",
    svcPrintDesc:
      "Schnelle und präzise Fertigung mit FDM- und SLA-Technologien in Industriequalität.",
    svcPrintF1: "Hohe Präzision",
    svcPrintF2: "Schnelle Produktion",
    svcPrintF3: "Kosteneffizient",
    svcPrintBtn: "Preis berechnen",
    svcModelTitle: "3D-Modellierungsservice",
    svcModelDesc:
      "Wir verwandeln Ihre Ideen mit unseren Design-Experten in Realität.",
    svcModelF1: "Professionelles Design",
    svcModelF2: "Revisionssupport",
    svcModelF3: "Technische Zeichnung",
    svcModelBtnWa: "WhatsApp",
    svcModelBtnCall: "Anrufen",

    locTitle: "Unser Standort",
    locAddressLabel: "Adresse",
    footerBrand: "kesiolabs",
    footerNote: "Alle Rechte vorbehalten.",

    colorNames: {
      Siyah: "Schwarz",
      Beyaz: "Weiß",
      Gri: "Grau",
      Kırmızı: "Rot",
      Mavi: "Blau",
      Altın: "Gold",
      Gümüş: "Silber",
      Bakır: "Kupfer",
      Şeffaf: "Transparent",
    },

    extra1Title: "Kennen Sie diese Probleme?",
    extra1Bullets: [
      "Sind Metall- oder Kunststoffteile zu teuer?",
      "Dauert die Beschaffung bis zu 8 Wochen?",
      "Sprengen Werkzeug-/Formkosten Ihr Budget?",
      "Ersatzteile sind nicht mehr erhältlich?",
      "Maschine steht – benötigen Sie dringend Teile?"
    ],
    extra2TitleA: "Mit kesiolabs ",
    extra2TitleB: "Vorteile des 3D‑Drucks",
    extra2Bullets: [
      "Schnelle und zuverlässige Lieferung",
      "Online-Kalkulation und Bestellung",
      "Stets erreichbarer Support",
      "Keine Werkzeug-/Formkosten",
      "Einfache Auftragsverfolgung"
    ],
    extra3Title: "Warum kesiolabs?",
    extra3P:
      "3D-Druck ermöglicht schnelle Ersatzteilfertigung zu geringen Kosten. Mit unserer Erfahrung liefern wir die passende Lösung für Ihren Bedarf.",
    extra3QTitle: "Fragen, die Sie sich beim Bestellen stellen:",
    extra3QBullets: [
      "Welches Material passt am besten?",
      "Welche Infill‑Prozentzahl sollte ich wählen?",
      "FDM oder SLA für meinen Anwendungsfall?",
      "Wie designe ich mein Modell druckgerecht?"
    ],

    faqTitle: "Wie können wir Ihnen helfen?",
    faqHint: "Schnelle Antworten auf häufige Fragen.",
    faqItems: [
      {
        q: "Wie lade ich meine 3D-Datei hoch?",
        a: "Ziehen Sie Ihre STL-Datei in das Upload-Feld oder wählen Sie sie per Klick. Die Vorschau und Berechnung starten sofort."
      },
      {
        q: "Wie wird der Preis berechnet?",
        a: "Die Geometrie wird analysiert, Volumina für Wände/Top-Bottom/Infill geschätzt und mit der Materialdichte sowie dem Grammpreis verrechnet."
      },
      {
        q: "Welche Materialien gibt es?",
        a: "Wir bieten PLA, Silk PLA, PETG, ABS, ASA und TPU. Für UV/Outdoor empfehlen wir ASA, für flexible Teile TPU."
      },
      {
        q: "Wie lange dauert Produktion & Versand?",
        a: "In der Regel 1–3 Werktage bis zur Übergabe an den Versand. Für Eilaufträge kontaktieren Sie uns bitte."
      },
      {
        q: "Mein Upload schlägt fehl – was tun?",
        a: "Exportieren Sie die STL erneut (binary), reduzieren Sie die Dreieckszahl und vermeiden Sie Sonderzeichen im Dateinamen."
      }
    ],

    company: {
      heading: "Kontakt & Öffnungszeiten",
      emailLabel: "E‑Mail",
      phoneLabel: "Telefon",
      addressLabel: "Adresse",
      hoursLabel: "Öffnungszeiten",
      madeIn: "Made in Türkiye"
    }
  },

  en: {
    language: "Language",
    navHome: "Home",
    navAbout: "About",
    navHow: "How It Works",
    navQuote: "Get a Quote",
    navBlog: "Blog",
    title: "🧊 3D Printing – Instant Quote",
    heroTitle: "3D Printing Comparison Portal",
    heroSubtitle:
      "Compare manufacturers worldwide in real time. Order industrial-grade parts at the best price — whether it’s $10 or $10,000, we’ll handle the rest.",
    blogTitle: 'KesioLabs Blog',
    blogIntro: 'Soon you will find articles here about 3D printing, materials and production tips.',
    blogEmpty: 'No blog posts have been added yet. We will be here soon.',
    backToMain: 'Back to main page',
    blogPosts: [],
    cta: "Get Instant Quote",

    aboutTitle: "About Us",
    aboutSubtitle: "We make the future of manufacturing more accessible.",
    aboutP1:
      "kesiolabs is a manufacturing-tech startup focused on transparent pricing and reliable lead times in rapid prototyping and small-batch production.",
    aboutP2:
      "Upload your STL and our system analyzes the geometry, then computes weight/time/price live based on material, infill and layer settings. With kesiolabs you get more than a quote — you get a clear path to production.",

    howTitle: "How it works",
    howSub: "Get your quote in just three steps.",
    how1Title: "Upload STL",
    how1Body:
      "Drop your STL; the model appears instantly and calculations begin.",
    how1Image: "/images/how1.png",
    how2Image: "/images/how2.png",
    how3Image: "/images/how3.png",
    how2Title: "Choose options",
    how2Body:
      "Pick color, material, infill and quantity; weight, time and price update.",
    how2Link: "Browse materials",
    how3Title: "Approve & we print",
    how3Body:
      "Save the quote and send via WhatsApp/email; we schedule production.",
    howCta: "Get Instant Quote",

    stl: "STL File",
    material: "Material",
    brand: "Brand",
    color: "Color",
    infill: "Infill (%)",
    qty: "Quantity",
    chooseStl: "Model will appear after STL upload.",
    solidVol: "Solid Volume",
    effVol: "Effective Volume (wall + top/bottom + infill)",
    weight: "Weight",
    length: "Filament Length",
    gprice: "Gram Price",
    unit: "Unit Price",
    total: "Total",
    perPiece: "/ piece",

    materialsTitle: "Professional Material Variety",
    m_pla: "PLA",
    m_silk: "Silk PLA",
    m_petg: "PETG",
    m_abs: "ABS",
    m_asa: "ASA",
    m_tpu: "TPU",

    mdesc: {
      pla: `<b>PLA (Polylactic Acid)</b>: Easy to print, low-warp, and eco‑friendly thermoplastic.<br/>
            <b>Advantages:</b>
            <ul>
              <li>Low shrinkage; rarely needs raft or enclosure.</li>
              <li>High surface quality and detail accuracy for visual parts.</li>
              <li>Low odor and broad color availability.</li>
            </ul>
            <b>Applications:</b> Presentation/visual prototypes, scale models, hobby items, light-duty fixtures.`,
      silk: `<b>Silk PLA</b>: A PLA variant with metallic/glossy finish for premium looks.<br/>
             <b>Advantages:</b>
             <ul>
               <li>Very smooth, shiny surface that can mask layer lines.</li>
               <li>PLA-like ease of printing; low warping.</li>
               <li>Rich effect colors (gold, silver, copper).</li>
             </ul>
             <b>Applications:</b> Decorative objects, display models, gifts, aesthetic prototypes.`,
      petg: `<b>PETG</b>: Balanced between PLA and ABS; tough with chemical resistance.<br/>
             <b>Advantages:</b>
             <ul>
               <li>Good impact strength and elevated heat resistance (~70–80°C).</li>
               <li>Low odor; food‑contact grades exist.</li>
               <li>Strong layer adhesion — suitable for functional parts.</li>
             </ul>
             <b>Applications:</b> Functional prototypes, brackets, covers, semi‑transparent enclosures.`,
      abs: `<b>ABS</b>: Classic engineering plastic with high strength; excellent post‑processing.<br/>
            <b>Advantages:</b>
            <ul>
              <li>High temperature and impact resistance.</li>
              <li>Sands/machines well; acetone vapor smoothing possible.</li>
              <li>Produces robust, test‑ready parts.</li>
            </ul>
            <b>Applications:</b> Mechanical prototypes, housings, automotive interior parts, jigs & fixtures.`,
      asa: `<b>ASA</b>: ABS‑like, but with superior UV and weather resistance.<br/>
            <b>Advantages:</b>
            <ul>
              <li>Excellent UV stability — ideal for outdoor use.</li>
              <li>Good dimensional stability and smooth finish.</li>
              <li>Mechanical properties comparable to ABS.</li>
            </ul>
            <b>Applications:</b> Outdoor components, field enclosures, signage/accessories, exterior prototypes.`,
      tpu: `<b>TPU</b>: Flexible, rubber‑like elastomer filament.<br/>
            <b>Advantages:</b>
            <ul>
              <li>High elasticity, vibration damping, and abrasion resistance.</li>
              <li>Resists cracking; shock‑absorbing behavior.</li>
              <li>Enables non‑slip, grippy surfaces.</li>
            </ul>
            <b>Applications:</b> Phone/tool cases, seals/gaskets, feet/pads, flexible hinges, bumpers.`,
    },

    note1: "Uploaded files must be in STL format.",
    note2:
      "Available filament colors may vary; black, gray and white are usually in stock. Contact us for other colors.",
    note3Before: "The price shown after upload is",
    noteEmph: "AN ESTIMATE!",
    note3After:
      "It’s based on assumptions; depending on geometry, print time and infill, the final price may vary.",

    svcBadge: "Our Services",
    svcTitle: "3D Solutions",
    svcSub: "Tailored 3D services for your needs",
    svcPrintTitle: "3D Printing Service",
    svcPrintDesc:
      "Fast, precise manufacturing with industrial-grade FDM and SLA technologies.",
    svcPrintF1: "High Precision",
    svcPrintF2: "Fast Production",
    svcPrintF3: "Cost Effective",
    svcPrintBtn: "Calculate Price",
    svcModelTitle: "3D Modeling Service",
    svcModelDesc:
      "We turn your ideas into reality with our expert designers.",
    svcModelF1: "Professional Design",
    svcModelF2: "Revision Support",
    svcModelF3: "Technical Drawing",
    svcModelBtnWa: "WhatsApp",
    svcModelBtnCall: "Call",

    locTitle: "Our Location",
    locAddressLabel: "Address",
    footerBrand: "kesiolabs",
    footerNote: "All Rights Reserved.",

    colorNames: {
      Siyah: "Black",
      Beyaz: "White",
      Gri: "Grey",
      Kırmızı: "Red",
      Mavi: "Blue",
      Altın: "Gold",
      Gümüş: "Silver",
      Bakır: "Copper",
      Şeffaf: "Transparent",
    },

    extra1Title: "Do these problems sound familiar?",
    extra1Bullets: [
      "Metal or plastic parts too expensive?",
      "Lead times stretching to 8 weeks?",
      "Tooling/mould costs exceed your budget?",
      "Spare parts no longer available?",
      "Machine down and you need parts urgently?"
    ],
    extra2TitleA: "With kesiolabs ",
    extra2TitleB: "3D Printing Advantages",
    extra2Bullets: [
      "Fast and reliable delivery",
      "Online pricing & ordering",
      "Always‑available support",
      "No tooling or mould costs",
      "Easy order tracking"
    ],
    extra3Title: "Why kesiolabs?",
    extra3P:
      "3D printing enables rapid spare part manufacturing at low cost. With our experience, we deliver the right solution for your needs.",
    extra3QTitle: "Questions you might ask before ordering:",
    extra3QBullets: [
      "Which material is best for me?",
      "What infill percentage should I choose?",
      "FDM or SLA for my application?",
      "How should I design the model for printing?"
    ],

    faqTitle: "How can we help?",
    faqHint: "Quick answers to common questions.",
    faqItems: [
      {
        q: "How can I upload my 3D file?",
        a: "Drag & drop your STL or click the field to select. Preview and calculations start instantly."
      },
      {
        q: "How is the price calculated?",
        a: "We estimate wall/top-bottom/infill volumes from geometry, convert to weight using material density and multiply by gram price."
      },
      {
        q: "Which materials are available?",
        a: "PLA, Silk PLA, PETG, ABS, ASA and TPU. For UV/outdoor use choose ASA; for flexible parts choose TPU."
      },
      {
        q: "How long does production & shipping take?",
        a: "Typically 1–3 business days to produce and hand over to the carrier. Contact us for rush jobs."
      },
      {
        q: "Upload fails or file is too large — what can I do?",
        a: "Re-export STL (binary), reduce triangle count, and avoid special characters in the filename."
      }
    ],

    company: {
      heading: "Contact & Opening Hours",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      hoursLabel: "Working Hours",
      madeIn: "Made in Türkiye"
    }
  },
};

const FX = { TRY: 1, EUR: 48, USD: 45 };
function fmtLocalCurrency(nTRY, lang) {
  const map = { tr: ["tr-TR", "TRY"], de: ["de-DE", "EUR"], en: ["en-US", "USD"] };
  const [locale, code] = map[lang] || map.tr;
  const val = code === "TRY" ? nTRY : code === "EUR" ? nTRY / FX.EUR : nTRY / FX.USD;
  return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(val);
}

/* =========================================================
 *  DATA
 * ======================================================= */
const BRANDS = [
  { id: "porima", label: "Porima" },
  { id: "microzey", label: "Microzey" },
  { id: "istanbul", label: "İstanbul Filament" },
  { id: "esun", label: "eSUN" },
];

const MATERIALS = [
  { id: "pla", name: "PLA", density: 1.24, colors: ["Siyah", "Beyaz", "Gri", "Kırmızı", "Mavi"], brands: BRANDS },
  { id: "silk_pla", name: "Silk PLA", density: 1.2, colors: ["Siyah", "Beyaz", "Altın", "Gümüş", "Bakır"], brands: BRANDS },
  { id: "asa", name: "ASA", density: 1.07, colors: ["Siyah", "Beyaz", "Gri"], brands: BRANDS },
  { id: "abs", name: "ABS", density: 1.04, colors: ["Siyah", "Beyaz", "Gri"], brands: BRANDS },
  { id: "petg", name: "PETG", density: 1.27, colors: ["Siyah", "Beyaz", "Şeffaf"], brands: BRANDS },
  { id: "tpu", name: "TPU", density: 1.22, colors: ["Siyah", "Beyaz", "Gri"], brands: BRANDS },
];

const COLORS = [
  "#000000", // Siyah
  "#1e293b", // Koyu Gri
  "#64748b", // Gri
  "#ffffff", // Beyaz
  "#f97316", // Turuncu
  "#facc15", // Sarı
  "#ef4444", // Kırmızı
  "#2563eb", // Mavi
  "#22c55e", // Yeşil
  "#ec4899", // Pembe
  "#78350f", // Kahverengi
  "#7f1d1d", // Bordo
  "#38bdf8", // Açık Mavi
  "#9333ea"  // Mor
];

function gramPriceTRY(qty) {
  if (qty >= 500) return 2;
  if (qty >= 250) return 3;
  if (qty >= 100) return 4;
  return 5;
}

/* =========================================================
 *  GEOMETRY HELPERS
 * ======================================================= */
function computeVolumeMM3(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const p = g.attributes.position.array;
  let v = 0;
  for (let i = 0; i < p.length; i += 9) {
    const ax = p[i], ay = p[i + 1], az = p[i + 2];
    const bx = p[i + 3], by = p[i + 4], bz = p[i + 5];
    const cx = p[i + 6], cy = p[i + 7], cz = p[i + 8];
    v += (ax * by * cz + bx * cy * az + cx * ay * bz - ax * cy * bz - bx * ay * cz - cx * by * az) / 6.0;
  }
  return Math.abs(v);
}
function computeSurfaceAreasMM2(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const p = g.attributes.position.array;
  let SA = 0, SA_horiz = 0;
  for (let i = 0; i < p.length; i += 9) {
    const ax = p[i], ay = p[i + 1], az = p[i + 2];
    const bx = p[i + 3], by = p[i + 4], bz = p[i + 5];
    const cx = p[i + 6], cy = p[i + 7], cz = p[i + 8];

    const abx = bx - ax, aby = by - ay, abz = bz - az;
    const acx = cx - ax, acy = cy - ay, acz = cz - az;

    const cxp = aby * acz - abz * acy;
    const cyp = abz * acx - abx * acz;
    const czp = abx * acy - aby * acx;

    const area2 = cxp * cxp + cyp * cyp + czp * czp;
    const area = 0.5 * Math.sqrt(area2);
    SA += area;

    const len = Math.sqrt(area2) || 1;
    const ny = cyp / len;
    if (Math.abs(ny) > 0.9) SA_horiz += area;
  }
  return { SA, SA_horiz };
}

/* =========================================================
 *  CHECKER PLATE
 * ======================================================= */
const ORANGE = "#3b82f6"; // main blue
function TransparentCheckerPlate({ size = 256, height = 256, radius = 14 }) {
  const shape = useMemo(() => {
    const w = size, h = size, r = Math.min(radius, size / 8);
    const x = -w / 2, y = -h / 2;
    const s = new THREE.Shape();
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, 1.5 * Math.PI, false);
    return s;
  }, [size, radius]);

  const checkerTex = useMemo(() => {
    const px = 2048, k = px / size;
    const c = document.createElement("canvas");
    c.width = px; c.height = px;
    const g = c.getContext("2d");

    const cell = 18 * k;
    const a1 = 0.12, a2 = 0.04;
    const col1 = (a) => `rgba(59,130,246,${a})`;
    const col2 = (a) => `rgba(255,255,255,${a})`;

    g.clearRect(0, 0, px, px);
    for (let y = 0; y < px; y += cell) {
      for (let x = 0; x < px; x += cell) {
        const odd = ((x / cell) + (y / cell)) % 2 === 1;
        g.fillStyle = odd ? col1(a1) : col2(a2);
        g.fillRect(x, y, cell, cell);
      }
    }
    g.strokeStyle = "rgba(59,130,246,.10)";
    g.lineWidth = 1;
    g.beginPath();
    for (let i = 0; i <= px; i += 10 * k) {
      g.moveTo(i + 0.5, 0); g.lineTo(i + 0.5, px);
      g.moveTo(0, i + 0.5); g.lineTo(px, i + 0.5);
    }
    g.stroke();

    const texture = new THREE.CanvasTexture(c);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [size]);

  const borderGeo = useMemo(() => {
    const pts = shape.getPoints(256);
    return new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, p.y, 0)));
  }, [shape]);

  return (
    <group>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <mesh>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial
            color="#ffffffff"
            map={checkerTex}
            transparent
            opacity={1}
            depthWrite={true}
            roughness={0.95}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
        <line>
          <primitive object={borderGeo} attach="geometry" />
          <lineBasicMaterial color={"#60a5fa"} />
        </line>
      </group>

      <lineSegments position={[0, height / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, height, size)]} />
        <lineBasicMaterial color={"#60a5fa"} />
      </lineSegments>
    </group>
  );
}

/* =========================================================
 *  STL MODEL
 * ======================================================= */
function Model({ url, color, onReady }) {
  const geometry = useLoader(STLLoader, url);

  const prepared = useMemo(() => {
    const geo = geometry.clone();
    geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geo.computeBoundingBox(); geo.computeBoundingSphere();
    const box = geo.boundingBox, sph = geo.boundingSphere;
    geo.translate(-sph.center.x, -box.min.y, -sph.center.z);

    const volumeMM3 = computeVolumeMM3(geo);
    const { SA, SA_horiz } = computeSurfaceAreasMM2(geo);
    onReady?.({ volumeMM3, SA_mm2: SA, SAh_mm2: SA_horiz });
    return geo;
  }, [geometry, onReady]);

  return (
    <mesh geometry={prepared}>
      <meshStandardMaterial color={color} metalness={0.18} roughness={0.58} />
    </mesh>
  );
}

/* =========================================================
 *  UI SMALLS
 * ======================================================= */
const SHADOW = "0 10px 30px rgba(15, 23, 42, .08)";
const card = (children, style = {}) => (
  <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #e5e7eb", boxShadow:SHADOW, ...style }}>
    {children}
  </div>
);
const label = (t) => <label style={{ fontSize: 13, opacity: 0.9, color: "#0f172a" }}>{t}</label>;
const inputBase = {
  display: "block", width: "100%", marginTop: 6, padding: 10, borderRadius: 12,
  border: "1px solid #e5e7eb", background: "#fff", color: "#0f172a", outline: "none"
};

/* =========================================================
 *  STICKY HEADER
 * ======================================================= */
function StickyHeader({ lang, setLang, title, t, activePage, setActivePage }) {
  const height = 58;
  const brand = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img
  src="/logo1.png"
  alt="KesioLabs Logo"
  style={{
    width: 170,
    height: 170,
    borderRadius: 6,
    objectFit: "contain",
  }}
/>

    </div>
  );
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 1000, height,
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 16px", background: "#ffffff", boxShadow: "0 1px 0 #dadde2"
    }}>
      {brand}
      <nav style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
        <a
          href="#hero"
          style={{
            textDecoration: "none",
            color: "#1f2937",
            fontWeight: 600,
            padding: "6px 8px",
            borderRadius: 999,
            cursor: "pointer"
          }}
        >
          {t.navHome}
        </a>
        <a
          href="#about"
          style={{
            textDecoration: "none",
            color: "#1f2937",
            fontWeight: 600,
            padding: "6px 8px",
            borderRadius: 999,
            cursor: "pointer"
          }}
        >
          {t.navAbout}
        </a>
        <a
          href="#how"
          style={{
            textDecoration: "none",
            color: "#1f2937",
            fontWeight: 600,
            padding: "6px 8px",
            borderRadius: 999,
            cursor: "pointer"
          }}
        >
          {t.navHow}
        </a>
        <a
          href="#quote"
          style={{
            textDecoration: "none",
            color: "#1f2937",
            fontWeight: 600,
            padding: "6px 8px",
            borderRadius: 999,
            cursor: "pointer"
          }}
        >
          {t.navQuote}
        </a>
        <button
          type="button"
          onClick={() => setActivePage && setActivePage("blog")}
          style={{
            background: "transparent",
            border: "none",
            textDecoration: "none",
            color: "#111827",
            fontWeight: 700,
            padding: "6px 10px",
            borderRadius: 999,
            cursor: "pointer"
          }}
        >
          {t.navBlog}
        </button>
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>

        <b style={{ color: "#111827", fontSize: 13, marginRight: 6 }}>{t.language}:</b>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{
            padding: "10px 12px", borderRadius: 12, border: "1px solid #d1d5db",
            background: "#fff", color: "#0f172a"
          }}
        >
          <option value="tr">Türkçe (TRY)</option>
          <option value="de">Deutsch (EUR)</option>
          <option value="en">English (USD)</option>
        </select>
        <div style={{ fontWeight: 800, color: "#111827", fontSize: 18, marginLeft: 8 }}>{title}</div>
      </div>
      <div style={{ marginLeft: 12, width: 120, height: 4, borderRadius: 999, background: ORANGE }} />
    </header>
  );
}

/* =========================================================
 *  HERO
 * ======================================================= */
function Hero({ onCTA, t }) {
  return (
    <section id="hero" style={{
      background: "#fff", padding: "56px 20px 36px",
      borderBottom: "1px solid #f1f5f9"
    }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 24, alignItems: "center"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 46, lineHeight: 1.1, color: "#0f172a", fontWeight: 900 }}>
            {t.heroTitle}
          </h1>
          <div style={{ marginTop: 14, fontSize: 18, color: "#1f2937", maxWidth: 640 }}>
            {t.heroSubtitle}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <button
              onClick={onCTA}
              style={{
                background: ORANGE, color: "#fff", fontWeight: 800, fontSize: 18,
                padding: "14px 22px", borderRadius: 18, border: "none", cursor: "pointer",
                boxShadow: "0 12px 22px rgba(59,130,246,.28)"
              }}
            >
              {t.cta}
            </button>
          </div>
        </div>
       <div

>
  <img
    src="/görsel1.jpg"
    alt="3D Baskı"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
</div>

      </div>
    </section>
  );
}

/* =========================================================
 *  ABOUT
 * ======================================================= */
function About({ t }) {
  const wrap = { maxWidth: 1120, margin: "0 auto", padding: "48px 20px 24px" };
  const title = { margin: 0, fontSize: 30, color: "#0f172a", fontWeight: 900 };
  const sub = { marginTop: 6, fontSize: 16, color: "#475569" };
  const p = { marginTop: 14, fontSize: 15.5, color: "#0f172a", lineHeight: 1.7, maxWidth: 980 };
  return (
    <section id="about" style={{ background: "#fff" }}>
      <div style={wrap}>
        <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={title}>{t.aboutTitle}</h2>
            <div style={sub}>{t.aboutSubtitle}</div>
            <p style={p}>{t.aboutP1}</p>
            <p style={p}>{t.aboutP2}</p>
          </div>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "#e2e8f0",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Buraya ortakların fotoğrafı için kendi <img> etiketinizi ekleyebilirsiniz.
                Örn: <img src="/ortaklar.png" alt="Kurucu ortaklar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 *  SHOWCASE SLIDER (9 images, 3 at a time)
 * ======================================================= */
function ShowcaseSlider() {
  const images = [
    "/images/slider1.jpg",
    "/images/slider2.jpg",
    "/images/slider3.jpg",
    "/images/slider4.jpg",
    "/images/slider5.jpg",
    "/images/slider6.jpg",
    "/images/slider7.jpg",
    "/images/slider8.jpg",
    "/images/slider9.jpg",
  ];
  const [groupIndex, setGroupIndex] = useState(0);
  const groups = Math.ceil(images.length / 3);

  useEffect(() => {
    if (!groups) return;
    const id = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % groups);
    }, 4000);
    return () => clearInterval(id);
  }, [groups]);

  const start = groupIndex * 3;
  const visible = images.slice(start, start + 3);

  return (
    <section style={{ background: "#f8fafc", padding: "32px 20px" }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
        }}
      >
        {visible.map((src, i) => (
          <div
            key={src + i}
            style={{
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={src}
              alt={"Showcase " + (start + i + 1)}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                display: "block",
                animation: "fadein 1s ease",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 *  HOW IT WORKS (with blue isometric svgs)
 * ======================================================= */
function IsoSvgStep1() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="140" fill="none" stroke={ORANGE} strokeWidth="2">
      <rect x="8" y="18" width="44" height="120" rx="6" stroke="#e2e8f0" />
      <rect x="188" y="12" width="44" height="124" rx="6" stroke="#e2e8f0" />
      <path d="M52 36h22M52 56h22M52 76h22M166 30h22M166 50h22M166 70h22" stroke="#94a3b8"/>
      <circle cx="120" cy="80" r="52" stroke="#94a3b8" strokeDasharray="6 6"/>
      <g transform="translate(76,46)">
        <rect x="0" y="26" width="88" height="48" rx="6" stroke={ORANGE}/>
        <rect x="30" y="0" width="28" height="24" rx="6" stroke={ORANGE}/>
        <path d="M14 26l32-16 32 16" />
        <path d="M14 74l32 16 32-16" />
        <circle cx="44" cy="48" r="14" />
        <circle cx="44" cy="48" r="5" fill={ORANGE}/>
      </g>
      <circle cx="48" cy="28" r="6" fill={ORANGE}/>
      <circle cx="192" cy="28" r="6" fill={ORANGE}/>
    </svg>
  );
}
function IsoSvgStep2() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="140" fill="none" stroke={ORANGE} strokeWidth="2">
      <g transform="translate(36,28)">
        <rect x="52" y="10" width="92" height="72" rx="8" stroke={ORANGE}/>
        <rect x="0" y="30" width="36" height="44" rx="6" stroke="#94a3b8"/>
        <rect x="164" y="10" width="36" height="62" rx="6" stroke="#94a3b8"/>
        <rect x="66" y="86" width="84" height="10" fill={ORANGE} stroke="none"/>
        <rect x="66" y="102" width="52" height="8" fill={ORANGE} stroke="none"/>
        <g transform="translate(92,30)">
          <rect x="-10" y="-10" width="20" height="20" rx="4"/>
          <rect x="-4" y="-20" width="8" height="10" rx="2"/>
          <rect x="18" y="8" width="46" height="6" rx="3" stroke="#94a3b8"/>
          <rect x="-64" y="40" width="46" height="6" rx="3" stroke="#94a3b8"/>
        </g>
      </g>
      <path d="M20 136l24-8M40 140l20-6" stroke="#e2e8f0"/>
    </svg>
  );
}
function IsoSvgStep3() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="140" fill="none" stroke={ORANGE} strokeWidth="2">
      <g transform="translate(40,36)">
        <path d="M0 80l56-32 88 0 56 32-88 32-112-32z" stroke="#94a3b8"/>
        <rect x="56" y="24" width="88" height="56" rx="8" stroke={ORANGE}/>
        <circle cx="100" cy="8" r="10" />
        <circle cx="100" cy="8" r="4" fill={ORANGE}/>
        <circle cx="74" cy="12" r="4" />
        <circle cx="126" cy="12" r="4" />
        <path d="M100 18v28" />
        <path d="M70 56l60-24" stroke="#94a3b8"/>
      </g>
      <path d="M182 20l8-4M194 30l10-6M30 20l-8-4" stroke="#e2e8f0"/>
    </svg>
  );
}
function HowItWorks({ t, onCtaClick }) {
  const base = {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 22px rgba(2,6,23,.06)",
    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
    position: "relative",
    overflow: "hidden",
  };
  const onHover = (e, enter) => {
    const el = e.currentTarget;
    if (enter) {
      el.style.transform = "translateY(-4px)";
      el.style.boxShadow = "0 16px 40px rgba(59,130,246,.18)";
      el.style.borderColor = "#bfdbfe";
    } else {
      el.style.transform = "none";
      el.style.boxShadow = "0 6px 22px rgba(2,6,23,.06)";
      el.style.borderColor = "#e5e7eb";
    }
  };
  const tab = () => ({
    position: "absolute",
    top: 0,
    left: 0,
    background: "#f8fafc",
    borderBottomRightRadius: 12,
    padding: "6px 12px",
    color: "#0f172a",
    fontWeight: 800,
    border: "1px solid #e5e7eb",
    borderTopLeftRadius: 16
  });

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
    alignItems: "stretch",
    maxWidth: 1120,
    margin: "0 auto"
  };

  return (
    <section id="how" style={{ background: "#fff", padding: "48px 20px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>{t.howTitle}</h2>
        <div style={{ marginTop: 6, color: "#475569" }}>{t.howSub}</div>
      </div>

      <div style={grid}>
        <div style={base} onMouseEnter={(e)=>onHover(e,true)} onMouseLeave={(e)=>onHover(e,false)}>
          <div style={tab()}>1</div>
          <img
            src={t.how1Image}
            alt={t.how1Title}            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }}
          />
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "#0f172a" }}>{t.how1Title}</div>
          <div style={{ color: "#475569", lineHeight: 1.5 }}>{t.how1Body}</div>
        </div>

        <div style={base} onMouseEnter={(e)=>onHover(e,true)} onMouseLeave={(e)=>onHover(e,false)}>
          <div style={tab()}>2</div>
          <img
            src={t.how2Image}
            alt={t.how2Title}            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }}
          />
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "#0f172a" }}>{t.how2Title}</div>
          <div style={{ color: "#475569", lineHeight: 1.5 }}>{t.how2Body}</div>
          <a href="#materials" style={{ color: ORANGE, textDecoration: "none", marginTop: 10, display: "inline-block", fontWeight: 600 }}>
            {t.how2Link} →
          </a>
        </div>

        <div style={base} onMouseEnter={(e)=>onHover(e,true)} onMouseLeave={(e)=>onHover(e,false)}>
          <div style={tab()}>3</div>
          <img
            src={t.how3Image}
            alt={t.how3Title}            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }}
          />
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "#0f172a" }}>{t.how3Title}</div>
          <div style={{ color: "#475569", lineHeight: 1.5 }}>{t.how3Body}</div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 26 }}>
        <button
          onClick={onCtaClick}
          style={{
            padding: "12px 18px",
            borderRadius: 14,
            border: "1px solid " + ORANGE,
            background: ORANGE,
            color: "white",
            fontWeight: 800,
            boxShadow: "0 10px 24px rgba(59,130,246,.28)",
            cursor: "pointer"
          }}
        >
          {t.howCta}
        </button>
      </div>
    </section>
  );
}

/* =========================================================
 *  SERVICES
 * ======================================================= */
const WHATSAPP_NUMBER = "+905537538182"
const PHONE_NUMBER = "+905537538182"

function Services({ t, onPriceClick }) {
  const wrap = { maxWidth: 1180, margin: "0 auto", padding: "56px 16px 64px" };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 28,
    alignItems: "stretch",
  };
  const cardS = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 22,
    boxShadow: SHADOW,
  };
  const badge = {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(59,130,246,.12)",
    color: ORANGE,
    fontWeight: 800,
    fontSize: 13
  };
  const title = { fontSize: 34, margin: "10px 0 6px", color: "#0f172a", fontWeight: 900, textAlign: "center" };
  const sub = { textAlign: "center", color: "#64748b", marginBottom: 26 };

  const iconWrap = {
    width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,.12)",
    display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12
  };
  const row = { display: "flex", alignItems: "center", marginBottom: 12 };

  const check = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
  const printIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <path d="M7 7V3h10v4M7 14h10" />
    </svg>
  );
  const cubeIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
      <path d="M12 2l8 4-8 4-8-4 8-4z" />
      <path d="M4 6v8l8 4 8-4V6" />
      <path d="M12 10v8" />
    </svg>
  );

  const btn = {
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    border: "1px solid transparent",
    cursor: "pointer"
  };

  return (
    <section id="about" style={{ background: "#fff" }}>
      <div style={wrap}>
        <div style={{ textAlign: "center" }}>
          <div style={badge}>{t.svcBadge}</div>
          <h2 style={title}>{t.svcTitle}</h2>
          <div style={sub}>{t.svcSub}</div>
        </div>

        <div style={grid}>
          <div style={cardS}>
            <div style={row}>
              <div style={iconWrap}>{printIcon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>{t.svcPrintTitle}</div>
            </div>
            <div style={{ color: "#475569", marginBottom: 14 }}>{t.svcPrintDesc}</div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", color: "#0f172a" }}>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcPrintF1}</span></li>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcPrintF2}</span></li>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcPrintF3}</span></li>
            </ul>
            <div style={{ marginTop: 16 }}>
              <button
                onClick={onPriceClick}
                style={{ ...btn, background: ORANGE, color: "#fff", boxShadow: "0 10px 24px rgba(59,130,246,.28)" }}
              >
                {t.svcPrintBtn} →
              </button>
            </div>
          </div>

          <div style={cardS}>
            <div style={row}>
              <div style={iconWrap}>{cubeIcon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>{t.svcModelTitle}</div>
            </div>
            <div style={{ color: "#475569", marginBottom: 14 }}>{t.svcModelDesc}</div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", color: "#0f172a" }}>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcModelF1}</span></li>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcModelF2}</span></li>
              <li style={row}>{check}<span style={{ marginLeft: 8 }}>{t.svcModelF3}</span></li>
            </ul>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank" rel="noreferrer"
                style={{ ...btn, background: "#22c55e", color: "#fff", textDecoration: "none" }}
              >
                {t.svcModelBtnWa}
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                style={{ ...btn, background: ORANGE, color: "#fff", textDecoration: "none" }}
              >
                {t.svcModelBtnCall}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 *  EXTRA INFO (I18N)
 * ======================================================= */
function ExtraInfo({ t }) {
  const containerStyle = {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "64px 20px",
  };
  const sectionTitle = {
    fontSize: 28,
    fontWeight: 900,
    color: "#0f172a",
  };
  const bulletList = {
    marginTop: 24,
    paddingLeft: 20,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.8,
  };
  return (
    <>
      <section style={{ background: "#f8fafc" }}>
        <div style={{ ...containerStyle, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <h2 style={sectionTitle}>
              <span>{t.extra1Title.split(" ").slice(0,-1).join(" ") + " "}</span>
              <span style={{ color: ORANGE }}>{t.extra1Title.split(" ").slice(-1)[0]}</span>
            </h2>
            <ul style={bulletList}>
              {t.extra1Bullets.map((x,i)=>(<li key={i}>{x}</li>))}
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <img src="/images/kutu.png" alt="3D print box" style={{ maxWidth: "100%", borderRadius: 12 }} />
          </div>
        </div>
      </section>

      <section style={{ background: "#fff" }}>
        <div style={{ ...containerStyle, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <img src="/images/kilit.png" alt="3D print advantages" style={{ maxWidth: "100%", borderRadius: 12 }} />
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <h2 style={sectionTitle}>
              <span style={{ color: "#0f172a" }}>{t.extra2TitleA}</span>
              <span style={{ color: ORANGE }}>{t.extra2TitleB}</span>
            </h2>
            <ul style={bulletList}>
              {t.extra2Bullets.map((x,i)=>(<li key={i}>{x}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ background: "#e2e8f0" }}>
        <div style={containerStyle}>
          <h2 style={{ ...sectionTitle, textAlign: "center" }}>
            {t.extra3Title.split(" ").length>1 ? (<><span>{t.extra3Title.split(" ").slice(0,1)} </span><span style={{ color: ORANGE }}>{t.extra3Title.split(" ").slice(1).join(" ")}</span></>) : t.extra3Title}
          </h2>
          <p style={{ marginTop: 20, fontSize: 16, color: "#334155", lineHeight: 1.8 }}>
            {t.extra3P}
          </p>
          <h3 style={{ marginTop: 36, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
            {t.extra3QTitle}
          </h3>
          <ul style={bulletList}>
            {t.extra3QBullets.map((x,i)=>(<li key={i}><a href="#materials" style={{ color: ORANGE }}>{x}</a></li>))}
          </ul>
          <p style={{ marginTop: 16, fontSize: 15, color: "#334155" }}>
            {/* placeholder for additional explanation if needed */}
          </p>
        </div>
      </section>
    </>
  );
}

/* =========================================================
 *  FAQ SECTION (Accordion)
 * ======================================================= */
function AccordionItem({ title, content, open, onToggle }) {
  return (
    <div style={{
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: open ? "#f3f4f6" : "#f5f5f5",
      overflow: "hidden",
      marginBottom: 10
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 16px",
          border: "none",
          background: "transparent",
          fontWeight: 800,
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer"
        }}
      >
        <span style={{
          display: "inline-flex",
          width: 22, height: 22, borderRadius: 6,
          alignItems: "center", justifyContent: "center",
          background: "#e5e7eb", color: "#0f172a", fontSize: 16
        }}>{open ? "−" : "+"}</span>
        <span>{title}</span>
      </button>
      {open && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb", color: "#334155" }}>
          {content}
        </div>
      )}
    </div>
  );
}
function FAQSection({ t }) {
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (i) => setOpenIndex((s) => (s === i ? -1 : i));
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 16px" }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a", fontWeight: 900 }}>{t.faqTitle}</h2>
        <div style={{ color: "#64748b", marginTop: 6 }}>{t.faqHint}</div>
        <div style={{ height: 12 }} />
        {t.faqItems.map((item, i) => (
          <AccordionItem
            key={i}
            title={item.q}
            content={item.a}
            open={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 *  LOCATION
 * ======================================================= */
const ADDRESS_TEXT = "İstanbul Maltepe, Fındıklı Mahallesi, Ermiş Sokak No: 17";
const MAP_Q = encodeURIComponent("Istanbul Maltepe Fındıklı Mahallesi Ermiş Sokak No 17");

function Location({ t }) {
  const wrap = { maxWidth: 1180, margin: "0 auto", padding: "12px 16px 56px" };
  const titleRow = { display: "flex", alignItems: "center", gap: 10, color: "#16a34a", fontSize: 18, fontWeight: 900 };
  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
      <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
  return (
    <section style={{ background:"#fff", borderTop:"1px solid #e5e7eb" }}>
      <div style={wrap}>
        <div style={titleRow}><span>{icon}</span><span style={{borderBottom:"3px solid #16a34a"}}>{t.locTitle}</span></div>
        <div style={{ height: 12 }} />
        <div style={{ color:"#0f172a", margin:"6px 0 12px" }}>
          <b>{t.locAddressLabel}:</b> {ADDRESS_TEXT}
        </div>
        <div style={{ borderRadius:12, overflow:"hidden", border:"1px solid #e5e7eb", boxShadow: SHADOW }}>
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${MAP_Q}&output=embed`}
            width="100%"
            height="420"
            style={{ border:0, display:"block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 *  BOTTOM COMPANY INFO (NO SOCIAL ICONS)
 * ======================================================= */
const COMPANY_EMAIL = "info@kesiolabs.com";
const COMPANY_PHONES = ["+90 533 383 94 38", "+90 553 753 81 82"];
const WORKING_HOURS = {
  tr: "Pzt–Cum 08:00–20:00 · Cmt 08:00–14:00",
  de: "Mo–Fr 08:00–20:00 · Sa 08:00–14:00",
  en: "Mon–Fri 08:00–20:00 · Sat 08:00–14:00"
};

function BottomInfo({ t, lang }) {
  const wrap = { maxWidth: 1180, margin: "0 auto", padding: "28px 16px" };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
    alignItems: "start"
  };
  const box = {
    background: "#0f172a",
    color: "#e5e7eb",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 40px rgba(2,6,23,.24)"
  };
  const lab = { fontSize: 13, opacity: .8, marginBottom: 6 };
  const val = { fontSize: 16, fontWeight: 800, color: "#fff" };
  const chip = {
    display: "inline-block",
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: 999,
    fontSize: 13,
    color: "#fff",
    background: "rgba(255,255,255,.06)",
    marginTop: 10
  };

  return (
    <section style={{ background: "#0b1220" }}>
      <div style={wrap}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
          {t.company?.heading || "Contact & Hours"}
        </div>
        <div style={grid}>
          <div style={box}>
            <div style={lab}>{t.company?.emailLabel || "Email"}</div>
            <div style={val}>
              <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "#fff", textDecoration: "none" }}>{COMPANY_EMAIL}</a>
            </div>
          </div>
          <div style={box}>
            <div style={lab}>{t.company?.phoneLabel || "Phone"}</div>
            <div style={val}>
              {COMPANY_PHONES.map((ph, i) => (
                <div key={i}><a href={`tel:${ph.replace(/\s/g,"")}`} style={{ color: "#fff", textDecoration: "none" }}>{ph}</a></div>
              ))}
            </div>
          </div>
          <div style={box}>
            <div style={lab}>{t.company?.addressLabel || t.locAddressLabel || "Address"}</div>
            <div style={val}>{ADDRESS_TEXT}</div>
          </div>
          <div style={box}>
            <div style={lab}>{t.company?.hoursLabel || "Working Hours"}</div>
            <div style={val}>{WORKING_HOURS[lang] || WORKING_HOURS.tr}</div>
            <div style={{ ...chip, display: "flex", alignItems: "center", gap: "6px" }}>
  <img src="/Turkey.png" alt="Made in Türkiye" width="22" height="15" />
  <span>{t.company?.madeIn || "Made in Türkiye"}</span>
</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 *  FLOATING CONTACT
 * ======================================================= */
function FloatingContact() {
  const wrap = {
    position: "fixed", left: 16, bottom: 16,
    display: "flex", gap: 12, alignItems: "center", zIndex: 1002
  };
  const circle = (bg) => ({
    width: 56, height: 56, borderRadius: "50%", background: bg,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,.18)", textDecoration: "none", border: "none"
  });

  const PATH_PHONE =
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.17 9.8 19.8 19.8 0 0 1 .1 1.18 2 2 0 0 1 2.06 0h3a2 2 0 0 1 2 1.72c.13 .98.34 1.94.63 2.87a2 2 0 0 1-.45 2.11L6.1 8.1a16 16 0 0 0 7.8 7.8l1.39-1.14a2 2 0 0 1 2.11-.45c.93.29 1.89.5 2.87.63A2 2 0 0 1 22 16.92z";

const WhatsAppIcon = () => (
  <img
    src="/images/whatsapp.png"
    alt="WhatsApp"
    width={28}
    height={28}
    style={{
      display: "block",
      objectFit: "contain",
      pointerEvents: "none"
    }}
  />
);

const PhoneIcon = () => (
  <img
    src="/images/phone.png"
    alt="Telefon"
    width={28}
    height={28}
    style={{
      display: "block",
      objectFit: "contain",
      pointerEvents: "none"
    }}
  />
);


  return (
    <div style={wrap}>
      <a href={`https://wa.me/${"+905537538182".replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp" style={circle("#22c55e")}>
        <WhatsAppIcon />
      </a>
      <a href={`tel:+905537538182`} aria-label="Ara" title="Ara" style={circle("#3b82f6")}>
        <PhoneIcon />
      </a>
    </div>
  );
}


// app.jsx demo placeholder

function BlogPage({ t, onBack }) {
  const wrap = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "40px 20px 60px",
  };
  const title = {
    fontSize: 32,
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 8,
  };
  const intro = {
    fontSize: 16,
    color: "#475569",
    marginBottom: 26,
  };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  };
  const card = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 18,
    boxShadow: "0 8px 24px rgba(15,23,42,.06)",
  };

  const posts = (t && t.blogPosts) || [];

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 58px)" }}>
      <div style={wrap}>
        <button
          type="button"
          onClick={onBack}
          style={{
            marginBottom: 16,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            color: "#334155",
          }}
        >
          ← {t.backToMain}
        </button>

        <h1 style={title}>{t.blogTitle}</h1>
        <p style={intro}>{t.blogIntro}</p>

        <div style={grid}>
          {posts.map((p, idx) => (
            <article key={idx} style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                {p.title}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                {p.date}
              </div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                {p.excerpt}
              </p>
            </article>
          ))}

          {posts.length === 0 && (
            <div
              style={{ 
                ...card, 
                textAlign: "center", 
                fontSize: 14, 
                color: "#64748b" 
              }}
            >
              {t.blogEmpty}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function App() {
  const [lang, setLang] = useState("tr");
  const [activePage, setActivePage] = useState("landing");
  const t = I18N[lang];

  const [fileUrl, setFileUrl] = useState(null);
  const [volMM3, setVolMM3] = useState(0);
  const [surfMM2, setSurfMM2] = useState(0);
  const [horizMM2, setHorizMM2] = useState(0);

  const [materialId, setMaterialId] = useState("pla");
  const [brandId, setBrandId] = useState("porima");
  const [color, setColor] = useState(MATERIALS[0].colors[0]);
  const [infill, setInfill] = useState(20);
  const [qty, setQty] = useState(1);

  const material = MATERIALS.find((m) => m.id === materialId) || MATERIALS[0];

  // Renk paleti: PLA için tüm renkler, diğer malzemeler için sadece siyah / beyaz / gri
  const basicColorsHex = [COLORS[0], COLORS[2], COLORS[3]];
  const colorPalette = materialId === "pla" ? COLORS : basicColorsHex;

  const quoteRef = useRef(null);
  const scrollToQuote = () =>
    quoteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // --- Hesaplama Sabitleri ---
  const nozzle = 0.4,
    layerH = 0.2,
    walls = 2,
    topL = 5,
    botL = 5,
    flow = 1.06,
    infillEff = 1.0,
    CAL_K = 0.61;

  // --- Dosya Yükleme ---
  function onFile(e) {
    const f = e.target.files?.[0];
    if (f) setFileUrl(URL.createObjectURL(f));
  }

  // --- Malzeme Değişimi ---
  function onMaterialChange(id) {
    const m = MATERIALS.find((x) => x.id === id);
    setMaterialId(id);
    if (m) {
      setBrandId(m.brands[0].id);
      const isPla = id === "pla";
      const basicColorsHex = [COLORS[0], COLORS[2], COLORS[3]];
      const palette = isPla ? COLORS : basicColorsHex;
      setColor(palette[0]);
    }
  }

  // --- Hesaplamalar ---
  const solidCm3 = volMM3 / 1000.0;
  const SA_cm2 = surfMM2 / 100.0;
  const SAh_cm2 = horizMM2 / 100.0;
  const wallThick_cm = (walls * nozzle * 0.92) / 10.0;
  const Vtb_cm3 = SAh_cm2 * (topL + botL) * (layerH / 10.0);
  const SAside_cm2 = Math.max(0, SA_cm2 - SAh_cm2);
  let Vwall_cm3 = SAside_cm2 * wallThick_cm;
  Vwall_cm3 = Math.min(Vwall_cm3, solidCm3 * 0.35);
  const core_cm3 = Math.max(0, solidCm3 - Vtb_cm3 - Vwall_cm3);
  const Vinf_cm3 = core_cm3 * (infill / 100) * infillEff;
  const _Vtot_cm3 = (Vtb_cm3 + Vwall_cm3 + Vinf_cm3) * flow * CAL_K;
  const weightG = _Vtot_cm3 * material.density;
  const r_cm = 0.175 / 2;
  const areaFil_cm2 = Math.PI * r_cm * r_cm;
  const filamentMeters = _Vtot_cm3 / areaFil_cm2 / 100;
  const gTRY = gramPriceTRY(qty);
  const unitTRY = weightG * gTRY;
  const totalTRY = unitTRY * qty;

  const sectionPad = { padding: "18px 16px" };
  const headerHeight = 58;

  // --- Return ---
  return (
    <>
      <StickyHeader lang={lang} setLang={setLang} title={t.title} t={t} activePage={activePage} setActivePage={setActivePage} />
      {activePage === "landing" ? (
        <>
      <Hero onCTA={scrollToQuote} t={t} />
      <About t={t} />
      <ShowcaseSlider />
      <HowItWorks t={t} onCtaClick={scrollToQuote} />
      <ExtraInfo t={t} />
        </>
      ) : (
        <BlogPage t={t} onBack={() => setActivePage("landing")} />
      )}

      {/* Teklif Alanı */}
      <section id="quote" ref={quoteRef} style={{ background: "#fff", ...sectionPad }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 18 }}>
          {/* Sol Kısım (Form) */}
          {card(
            <>
              <div style={{ marginBottom: 14 }}>
                {label(t.stl)}
                <input
                  type="file"
                  accept=".stl"
                  onChange={onFile}
                  style={{ ...inputBase }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                {label(t.material)}
                <select
                  value={materialId}
                  onChange={(e) => onMaterialChange(e.target.value)}
                  style={{ ...inputBase }}
                >
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* RENKLER */}
              <div style={{ marginBottom: 14 }}>
                {label(t.color)}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {colorPalette.map((c) => {
                    const active = color === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 9999,
                          cursor: "pointer",
                          background: c,
                          border: active
                            ? "2px solid #0f172a"
                            : "1px solid #ccc",
                          boxShadow: active
                            ? "0 0 0 6px rgba(59,130,246,.24)"
                            : "0 2px 6px rgba(59,130,246,.18)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    {label(t.infill)}
                    <select
                      value={infill}
                      onChange={(e) => setInfill(Number(e.target.value))}
                      style={{ ...inputBase }}
                    >
                      {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(
                        (v) => (
                          <option key={v} value={v}>
                            {v}%
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    {label(t.qty)}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 6,
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          setQty((q) => Math.max(1, q - 1))
                        }
                        style={{
                          width: 44,
                          padding: 8,
                          borderRadius: 12,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          color: "#0f172a",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) =>
                          setQty(
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        }
                        style={{
                          ...inputBase,
                          textAlign: "center",
                          width: 80,
                        }}
                      />
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        style={{
                          width: 44,
                          padding: 8,
                          borderRadius: 12,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          color: "#0f172a",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sağ Kısım (3D Önizleme) */}
          {card(
            <>
              <div style={{ width: "100%", height: 540 }}>
                <Canvas camera={{ position: [180, 180, 180], fov: 55 }}>
                  <ambientLight intensity={0.9} />
                  <directionalLight
                    position={[10, 14, 10]}
                    intensity={0.9}
                  />
                  <TransparentCheckerPlate size={256} height={256} />

                  <Suspense fallback={null}>
                    {fileUrl ? (
                      <Model
                        url={fileUrl}
                        color={color}
                        onReady={({
                          volumeMM3,
                          SA_mm2,
                          SAh_mm2,
                        }) => {
                          setVolMM3(volumeMM3);
                          setSurfMM2(SA_mm2);
                          setHorizMM2(SAh_mm2);
                        }}
                      />
                    ) : null}
                  </Suspense>
                  <OrbitControls target={[0, 70, 0]} />
                </Canvas>
              </div>

              {!fileUrl && (
                <p
                  style={{
                    padding: 10,
                    margin: 0,
                    opacity: 0.8,
                    fontSize: 14,
                    color: "#475569",
                  }}
                >
                  {t.chooseStl}
                </p>
              )}
            </>
          )}
        </div>

        {/* 💰 Fiyat Bilgileri Kutusu */}
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            borderRadius: 14,
            background: "#fff",
            border: "1px solid #e5e7eb",
            color: "#0f172a",
            fontSize: 14,
            lineHeight: 1.6,
            boxShadow: SHADOW,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {t.unit}
              </div>
              <b style={{ fontSize: 22 }}>
                {fmtLocalCurrency(unitTRY, lang)} {t.perPiece}
              </b>
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {t.gprice}
              </div>
              <b style={{ fontSize: 20 }}>
                {fmtLocalCurrency(gTRY, lang)} / g
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {t.total}
              </div>
              <div style={{ fontSize: 34, fontWeight: 900 }}>
                {fmtLocalCurrency(totalTRY, lang)}
              </div>
            </div>
          </div>
        </div>

        {/* 📄 Önemli Notlar */}
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            borderRadius: 14,
            background: "#fff",
            border: "1px solid #e5e7eb",
            color: "#0f172a",
            fontSize: 14,
            lineHeight: 1.6,
            boxShadow: SHADOW,
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            <li>
              Fiyatlar yaklaşık değerlerdir; üretim öncesi kontrol
              sonrası değişiklik gösterebilir.
            </li>
            <li>
              Yalnızca <b>.STL</b> formatındaki dosyalar
              desteklenmektedir.
            </li>
            <li>
              Malzeme türü, doluluk oranı, model hacmi ve baskı süresi
              fiyatı etkiler.
            </li>
          </ul>
        </div>
      </section>
      {/* Alt Kısımlar */}
      <FAQSection t={t} />
      <Location t={t} />
      <BottomInfo t={t} lang={lang} />
      <FloatingContact />

      <footer
        style={{
          background: "#f8fafc",
          color: "#334155",
          padding: "18px 16px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 800, color: "#0f172a" }}>
            <img
              src="/logo2.png"
              alt={t.footerBrand}
              style={{ height: 20, width: "auto", objectFit: "contain" }}
            />
          </div>
          <div style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} {t.footerBrand}. {t.footerNote}
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </>
  );
}

export default App;