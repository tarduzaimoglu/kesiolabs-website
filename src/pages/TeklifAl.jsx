// src/pages/TeklifAl.jsx
import { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

import Model from "../components/Model";
import TransparentCheckerPlate from "../components/TransparentCheckerPlate";

import "./TeklifAl.css";

function LogoPanel() {
  const texture = useTexture("/kesiolabs-logo.png");

  return (
    <mesh position={[0, 90, -260]} rotation={[-0.25, 0, 0]}>
      <planeGeometry args={[300, 110]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export default function TeklifAl() {
  const [fileUrl, setFileUrl] = useState(null);
  const [volMM3, setVolMM3] = useState(0);
  const [surfMM2, setSurfMM2] = useState(0);
  const [horizMM2, setHorizMM2] = useState(0);

  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("#000000");
  const [infill, setInfill] = useState(20);
  const [qty, setQty] = useState(1);

  const MATERIAL_DENSITY = 1.24;
  const GRAM_PRICE = 5;
  const CAL_K = 0.61;

  const nozzle = 0.4,
    layerH = 0.2,
    walls = 2,
    topL = 5,
    botL = 5,
    flow = 1.06,
    infillEff = 1.0;

  function onFile(e) {
    const f = e.target.files?.[0];
    if (f) setFileUrl(URL.createObjectURL(f));
  }

  // 🔥 HESAPLAMA BLOĞU USEMEMO'YA ALINDI
  const { weightG, unitTRY, totalTRY } = useMemo(() => {
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

    const weightG = _Vtot_cm3 * MATERIAL_DENSITY;
    const unitTRY = weightG * GRAM_PRICE;
    const totalTRY = unitTRY * qty;

    return { weightG, unitTRY, totalTRY };
  }, [volMM3, surfMM2, horizMM2, infill, qty]); // 👈 bunlar değişince hesap yeniden çalışır

  return (
    <div className="teklif-wrapper">

      <h1 className="page-title">Teklif Al</h1>

      <div className="grid">

        {/* SOL FORM */}
        <div className="form-box">

          <label>STL Dosyası</label>
          <input type="file" accept=".stl" onChange={onFile} />

          <label>Malzeme</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="PLA">PLA</option>
            <option value="PETG">PETG</option>
            <option value="ABS">ABS</option>
            <option value="ASA">ASA</option>
          </select>

          <label>Renk</label>
          <div className="color-row">
            {["#000000", "#ffffff", "#ff3b3b", "#ffaa00", "#1e90ff", "#8a2be2"].map((c) => (
              <button
                key={c}
                className="color-dot"
                style={{
                  background: c,
                  border: c === color ? "3px solid #1e90ff" : "1px solid #ccc",
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <label>İç Doluluk (%)</label>
          <select value={infill} onChange={(e) => setInfill(Number(e.target.value))}>
            {[10, 15, 20, 25, 30, 40, 50].map((v) => (
              <option key={v} value={v}>{v}%</option>
            ))}
          </select>

          <label>Adet</label>
          <div className="qty-row">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
            <input type="number" value={qty} min={1} onChange={(e) => setQty(Number(e.target.value))}/>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div className="price-box">
            <div>
              <small>Birim Fiyat</small>
              <b>₺{unitTRY.toFixed(2)}</b>
            </div>
            <div>
              <small>Gram Fiyat</small>
              <b>₺5,00 / g</b>
            </div>
            <div>
              <small>Toplam</small>
              <span className="total">₺{totalTRY.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* SAĞ 3D ÖNİZLEME */}
        <div className="preview-box glass-panel">
          <div className="canvas-wrapper">

            <Canvas
              shadows
              camera={{
                fov: 38,
                position: [-300, 350, 700],
              }}
            >
              <color attach="background" args={["#f4f4f4"]} />

              <ambientLight intensity={0.55} />

              <directionalLight
                position={[6, 12, 6]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />

              <LogoPanel />
              <TransparentCheckerPlate size={260} />

              <Suspense fallback={null}>
                {fileUrl && (
                  <Model
                    url={fileUrl}
                    color={color}
                    position={[0, 0, 0]}
                    onReady={({ volumeMM3, SA_mm2, SAh_mm2 }) => {
                      setVolMM3(volumeMM3);
                      setSurfMM2(SA_mm2);
                      setHorizMM2(SAh_mm2);
                    }}
                  />
                )}
              </Suspense>

              <OrbitControls
                target={[0, 50, 0]}
                enablePan={false}
                minDistance={500.0}
                maxDistance={7.5}
                enableDamping={true}
                dampingFactor={0.08}
                rotateSpeed={0.30}
              />
            </Canvas>

          </div>

          {!fileUrl && (
            <p className="no-file">STL yükleyince model burada görünecek.</p>
          )}
        </div>

      </div>

      <div className="note-whatsapp-wrapper">
        <ul className="notes">
          <li>Fiyatlar yaklaşık değerlerdir; üretim öncesi kontrol sonrası değişiklik gösterebilir.</li>
          <li>Yalnızca <b>.STL</b> formatındaki dosyalar desteklenmektedir.</li>
          <li>Malzeme türü, doluluk oranı, model hacmi ve baskı süresi fiyatı etkiler.</li>
        </ul>

        <a
          className="wp-btn"
          href="https://wa.me/905537538182"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp ile İletişime Geç
        </a>
      </div>

    </div>
  );
}
