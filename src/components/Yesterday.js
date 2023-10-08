import React, { useState, useRef } from 'react';

const ROW_COUNT = 32;
const COLUMN_COUNT = 32;

export default function Yesterday({ colors, w, b }) {
  const [rotation, setRotation] = useState([0, -0.7853981634, 0]); // initial rotation
  const [scaleX, setScaleX] = useState(b); // initial scaleX

  const renderGroup = (colIndex) => {
    const meshes = [];
    let rowIndex = 0;
    while (rowIndex < ROW_COUNT) {
      const index = rowIndex * COLUMN_COUNT + colIndex;
      const color = colors[index];
      let consecutiveCount = 1;
      let nextIndex = index + COLUMN_COUNT;
      while (rowIndex + consecutiveCount < ROW_COUNT &&
             colors[nextIndex] === color) {
        consecutiveCount++;
        nextIndex += COLUMN_COUNT;
      }
      const height = consecutiveCount;
      if (height > 1) {
        meshes.push(
          <group
            key={`${colIndex}-${rowIndex}`}
            position={[
              -w / 2 + (w / COLUMN_COUNT) * colIndex,
              w / 2 - w / 64 - (w / 32) * rowIndex - (w / 32) * (height - 1),
              0,
            ]}
            rotation={rotation}
          >
            <mesh
              scale={[scaleX, w / COLUMN_COUNT * height, 1]}
              position={[b / 2, w / COLUMN_COUNT * (height - 1) / 2, 0]}
            >
              <planeGeometry />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      } else {
        meshes.push(
          <group
            key={`${colIndex}-${rowIndex}`}
            position={[
              -w / 2 + (w / COLUMN_COUNT) * colIndex,
              w / 2 - w / 64 - (w / 32) * rowIndex,
              0,
            ]}
            rotation={rotation}
          >
            <mesh
              scale={[scaleX, w / COLUMN_COUNT, 1]}
              position={[b / 2, 0, 0]}
            >
              <planeGeometry />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      }
      rowIndex += consecutiveCount;
    }
    return meshes;
  };
    
    return (
      <>
        {[...Array(ROW_COUNT)].map((_, rowIndex) => {
          return renderGroup(rowIndex);
        })}
      </>
    );

  }
