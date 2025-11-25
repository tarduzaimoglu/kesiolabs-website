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

    // Normaller ve bbox
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    let box = geometry.boundingBox;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 1) Merkeze al
    geometry.translate(-center.x, -center.y, -center.z);

    // 2) En geniş yüzeyi bul
    const areaXY = size.x * size.y;
    const areaXZ = size.x * size.z;
    const areaYZ = size.y * size.z;
    const maxArea = Math.max(areaXY, areaXZ, areaYZ);

    // 3) Tabanı yere döndür (Y up)
    if (maxArea === areaXY) {
      // XY taban → Z up, Y up'a çevir
      geometry.rotateX(Math.PI / 2);
    } else if (maxArea === areaYZ) {
      // YZ taban → X up, Y up'a çevir
      geometry.rotateZ(Math.PI / 2);
    }
    // XZ zaten Y up gibi, dokunmuyoruz

    // Rotasyondan sonra tekrar bbox al
    geometry.computeBoundingBox();
    geometry.boundingBox.getSize(size);
    geometry.boundingBox.getCenter(center);

    // 4) Tekrar merkeze al
    geometry.translate(-center.x, -center.y, -center.z);

    // 5) Zemine oturt (alt yüzey 0 olsun)
    geometry.translate(0, size.y / 2, 0);

    // 6) Hacim & yüzey alanı hesapla
    const posAttr = geometry.attributes.position;
    const indexAttr = geometry.index;
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();

    let volume = 0;         // mm³
    let surfaceArea = 0;    // mm²
    let horizArea = 0;      // mm² (Y ekseni normal ≈ ±1 olan yüzeyler)

    const getVertex = (i, target) => {
      target.set(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i)
      );
    };

    const triangleCount = indexAttr
      ? indexAttr.count / 3
      : posAttr.count / 3;

    for (let i = 0; i < triangleCount; i++) {
      let a, b, c;
      if (indexAttr) {
        a = indexAttr.getX(i * 3 + 0);
        b = indexAttr.getX(i * 3 + 1);
        c = indexAttr.getX(i * 3 + 2);
      } else {
        a = i * 3 + 0;
        b = i * 3 + 1;
        c = i * 3 + 2;
      }

      getVertex(a, vA);
      getVertex(b, vB);
      getVertex(c, vC);

      // Yüzey alanı
      const ab = new THREE.Vector3().subVectors(vB, vA);
      const ac = new THREE.Vector3().subVectors(vC, vA);
      const cross = new THREE.Vector3().crossVectors(ab, ac);
      const area = cross.length() * 0.5;
      surfaceArea += area;

      const normal = cross.clone().normalize();
      if (Math.abs(normal.y) > 0.9) {
        // neredeyse yatay yüzeyler
        horizArea += area;
      }

      // Hacim (orijine göre signed volume)
      const v = vA.dot(new THREE.Vector3().crossVectors(vB, vC)) / 6.0;
      volume += v;
    }

    const volumeMM3 = Math.abs(volume);      // mm³
    const SA_mm2 = surfaceArea;             // mm²
    const SAh_mm2 = horizArea;              // mm²

    if (onReady) {
      onReady({ volumeMM3, SA_mm2, SAh_mm2 });
    }
  }, [geometry, onReady]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
  );
}
