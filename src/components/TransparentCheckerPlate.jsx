// src/components/TransparentCheckerPlate.jsx
import * as THREE from "three";
import { useMemo } from "react";

export default function TransparentCheckerPlate({ size = 300 }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(size, size / 10, "#d0d0d0", "#e0e0e0");
    g.material.opacity = 0.32;
    g.material.transparent = true;
    g.material.depthWrite = false;
    return g;
  }, []);

  return <primitive object={grid} position={[0, -1, 0]} />;
}
<TransparentCheckerPlate size={300} height={300} opacity={0.25} />
