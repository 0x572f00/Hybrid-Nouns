import * as THREE from "three";
import React, { useRef, useState, useEffect} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Yesterday from './Yesterday.js';
import Today from './Today.js';
import { easing } from 'maath'
import { useNounsContext } from '../utils/NounsContext';

export function Frame({ colorsNoun1, colorsNoun2 }) {
    const { todayId, yesterdayId } = useNounsContext();
    const { width, height } = useThree((state) => state.viewport);
    const { mouse } = useThree();
    const group = useRef();
    const [focus, setFocus] = useState(true)
    const [vec] = useState(() => new THREE.Vector3());
    const camera = useThree((state) => state.camera);
    const scene = useThree((state) => state.scene);
    const gl = useThree((state) => state.gl);

    useFrame((state, delta) => {
      if(focus) {
        group.current.position.lerp(vec.set(0, 0, 0), 0.2)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y,0,.35);
      } else {
        group.current.position.lerp(vec.set(0, 0, -7.35), 0.2)
        if(mouse.x > 0.5) {
          easing.dampE(group.current.rotation, [0, -1.134464, 0], 0.5, delta)
        }
        if(mouse.x < -0.5) {
          easing.dampE(group.current.rotation, [0, 1.134464, 0], 0.5, delta)
        }
        if(mouse.x >= -0.5 && mouse.x <= 0.5) {
          easing.dampE(group.current.rotation, [0, 0, 0], 0.5, delta)
        }
      }
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
    })

    function Focus() {
      setFocus((focus) => !focus)
    }

    useEffect(() => {
      const handleClick = () => {
          GetBase64();
      };

      document.getElementById("saveJpg").addEventListener("click", handleClick);

      return () => {
          document.getElementById("saveJpg").removeEventListener("click", handleClick);
      };
    }, []);

    function GetBase64() {
      group.current.position.lerp(vec.set(0, 0, 0), 0)
      const renderer = gl;
      const size = document.getElementById('canvas').clientWidth;
      renderer.render(scene, camera);
      document.getElementById('hybrid').classList.add('flash');
      setTimeout(() => {
        renderer.setSize(900, 900);
      }, 200);
      setTimeout(() => {
        const base64Data = renderer.domElement.toDataURL('image/jpeg', 1);
        const downloadLink = document.createElement('a');
        downloadLink.href = base64Data;
        downloadLink.download = `HBN_${yesterdayId}-${todayId}.jpg`;
        downloadLink.click();
    
        // Clean up
        document.getElementById('canvas').classList.add('inactive')
        setTimeout(() => {
          renderer.setSize(size , size );
          document.getElementById('canvas').classList.remove('inactive')
          document.getElementById('hybrid').classList.remove('flash');
        }, 200);
      }, 300);
  }


    let w = height
    if(window.innerHeight > window.innerWidth) {
      w = width;
    }
    var b = Math.sqrt(Math.pow(w/64, 2) + (Math.pow(w/64, 2)))
    return (
      <>
      <group ref={group} position={[0,0,0]} rotation={[0,0,0]}>
        <mesh scale={[w,w,w]} position={[0,0,0]} onClick={() => (Focus())}>
          <planeGeometry/>
          <meshStandardMaterial wireframe opacity={0} transparent={true}/>
        </mesh>
        <group position={[b,0,0]}>

        <Today colors={colorsNoun1} w={w} b={b}/>
        </group>
        <group position={[b,0,0]}>
        <Yesterday colors={colorsNoun2} w={w} b={b} />

        </group>
      </group>
      <OrbitControls enableFocus={false} enablePan={false} enableZoom={false} enableRotate={false} dampingFactor={0.05} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2.5} maxAzimuthAngle={Math.PI / 2.5}/>
      </>
    )
  }