import * as THREE from "three"

export function captureScreenshot(canvasRef) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    const base64Data = renderer.domElement.toDataURL('image/png');
    console.log(base64Data);
    // You can save, display, or further process the base64Data here
  }
  