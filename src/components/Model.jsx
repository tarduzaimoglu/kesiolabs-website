// src/components/Model.jsx
import React, { useEffect, useRef } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Model({ url, color, onReady }) {
  const meshRef = useRef();
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    if (!geometry) return;

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    let box = geometry.boundingBox;
    let size = new THREE.Vector3();
    let center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    // 1️⃣ MERKEZE AL
    geometry.translate(-center.x, -center.y, -center.z);

    // 2️⃣ EN GENİŞ YÜZEYİ BUL
    const areaXY = size.x * size.y;
    const areaXZ = size.x * size.z;
    const areaYZ = size.y * size.z;

    const maxArea = Math.max(areaXY, areaXZ, areaYZ);

    // 3️⃣ TABANI BUL → O yüzeyi yere döndür
    if (maxArea === areaXY) {
      // XY taban → Z-up → Y-up çevir
      geometry.rotateX(Math.PI / 2);
    } else if (maxArea === areaYZ) {
      // YZ taban → X-up → Y-up çevir
      geometry.rotateZ(Math.PI / 2);
    } 
    // XZ taban zaten Y-up olur → işlem yok

    // Rotasyondan sonra tekrar bounding box hesapla
    geometry.computeBoundingBox();
    geometry.boundingBox.getSize(size);
    geometry.boundingBox.getCenter(center);

    // 4️⃣ TEKRAR MERKEZE AL
    geometry.translate(-center.x, -center.y, -center.z);

    // 5️⃣ ZEMİNE OTURT (alt yüzey = -size.y/2)
    geometry.translate(0, size.y / 2, 0);

    if (onReady) {
      onReady({
        volumeMM3: geometry.parameters?.volumeMM3 || 0,
        SA_mm2: geometry.parameters?.SA_mm2 || 0,
        SAh_mm2: geometry.parameters?.SAh_mm2 || 0,
      });
    }
  }, [geometry]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
  );
}
