import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useMemo } from 'react';
import './App.css';

// Individual cubelet face
function CubeletFace({
  position,
  rotation,
  color
}: {
  position: [number, number, number],
  rotation: [number, number, number],
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.9, 0.9]} />
      <meshStandardMaterial color={color} />
      {/* Rendering both sides of the plane to avoid "disappearing" at certain angles */}
      <meshStandardMaterial color={color} side={2} />
    </mesh>
  );
}

// Cubelet built from individual faces
function Cubelet({ position }: { position: [number, number, number] }) {
  // Standard Rubik's cube colors
  const red = 'red';       // Right face (+X)
  const orange = 'orange'; // Left face (-X)
  const yellow = 'yellow'; // Top face (+Y)
  const white = 'white';   // Bottom face (-Y)
  const green = 'green';   // Front face (+Z)
  const blue = 'blue';     // Back face (-Z)

  // Determine which faces should be visible
  const faces = useMemo(() => {
    const facesList = [];

    // Right face (+X)
    if (position[0] === 1) {
      facesList.push(
        <CubeletFace
          key="right"
          position={[0.451, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color={red}
        />
      );
    }

    // Left face (-X)
    if (position[0] === -1) {
      facesList.push(
        <CubeletFace
          key="left"
          position={[-0.451, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          color={orange}
        />
      );
    }

    // Top face (+Y)
    if (position[1] === 1) {
      facesList.push(
        <CubeletFace
          key="top"
          position={[0, 0.451, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={yellow}
        />
      );
    }

    // Bottom face (-Y)
    if (position[1] === -1) {
      facesList.push(
        <CubeletFace
          key="bottom"
          position={[0, -0.451, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          color={white}
        />
      );
    }

    // Front face (+Z)
    if (position[2] === 1) {
      facesList.push(
        <CubeletFace
          key="front"
          position={[0, 0, 0.451]}
          rotation={[0, 0, 0]}
          color={green}
        />
      );
    }

    // Back face (-Z)
    if (position[2] === -1) {
      facesList.push(
        <CubeletFace
          key="back"
          position={[0, 0, -0.451]}
          rotation={[0, Math.PI, 0]}
          color={blue}
        />
      );
    }

    return facesList;
  }, [position]);

  // Black cubelet base - slightly smaller to avoid z-fighting
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.89, 0.89, 0.89]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {faces}
    </group>
  );
}

function RubiksCube() {
  const cubelets = useMemo(() => {
    const pieces = [];

    // Generate positions for all 26 cubelets (excluding the center piece)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the invisible center piece
          if (!(x === 0 && y === 0 && z === 0)) {
            pieces.push(
              <Cubelet
                key={`${x},${y},${z}`}
                position={[x, y, z]}
              />
            );
          }
        }
      }
    }

    return pieces;
  }, []);

  return (
    <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
      {cubelets}
    </group>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [4, 4, 4], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
        />
        <RubiksCube />
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default App;