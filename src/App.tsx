import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import { RubiksCube } from './components/RubiksCube';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CubeletData, createInitialCubeState, rotateFace, Face } from './utils/cubeUtils';
import './App.css';

// Component to manage controls and provide reset function
function SceneControls({ setResetCallback }: { setResetCallback: (reset: () => void) => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const initialPosition = useRef<Vector3>(new Vector3(4, 4, 4));
  const initialTarget = useRef<Vector3>(new Vector3(0, 0, 0));

  const resetCamera = () => {
    if (controlsRef.current) {
      camera.position.copy(initialPosition.current);
      controlsRef.current.target.copy(initialTarget.current);
      controlsRef.current.update();
    }
  };

  // Pass reset function to parent
  setResetCallback(resetCamera);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false} // Keep cube centered
      enableZoom={true}
      minDistance={2.5} // Prevent seeing inside
      maxDistance={20}  // Limit zoom out
      target={[0, 0, 0]}
      mouseButtons={{
        LEFT: 0, // Rotate
        MIDDLE: 2, // Zoom
        RIGHT: 1 // Disabled (could be pan)
      }}
      dampingFactor={0.15} // Smooth rotation
    />
  );
}

function App() {
  const [cubeState, setCubeState] = useState<CubeletData[]>(createInitialCubeState());
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const resetCameraRef = useRef<(() => void) | null>(null);

  const performRandomMove = () => {
    const faces: Face[] = ['U', 'D', 'F', 'B', 'L', 'R'];
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const clockwise = Math.random() > 0.5;
    setCubeState(prevState => rotateFace(prevState, randomFace, clockwise));
  };

  const handleScramble = () => {
    if (!isScrambling) {
      setIsScrambling(true);
      let moveCount = 0;

      const scrambleStep = () => {
        if (moveCount < 20) {
          performRandomMove();
          moveCount++;
          requestAnimationFrame(scrambleStep);
        } else {
          setIsScrambling(false);
        }
      };

      requestAnimationFrame(scrambleStep);
    }
  };

  const handleReset = () => {
    setCubeState(createInitialCubeState());
    setIsScrambling(false);
  };

  const handleRecenter = () => {
    if (resetCameraRef.current) {
      resetCameraRef.current();
    }
  };

  const setResetCallback = (reset: () => void) => {
    resetCameraRef.current = reset;
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [4, 4, 4], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <RubiksCube cubeState={cubeState} onRotateFace={() => { }} />
        <SceneControls setResetCallback={setResetCallback} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={handleScramble}
          disabled={isScrambling}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isScrambling ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isScrambling ? 'not-allowed' : 'pointer',
          }}
        >
          {isScrambling ? 'Scrambling...' : 'Scramble Cube'}
        </button>

        <button
          onClick={handleReset}
          disabled={isScrambling}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isScrambling ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isScrambling ? 'not-allowed' : 'pointer',
          }}
        >
          Reset Cube
        </button>

        <button
          onClick={handleRecenter}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Recenter
        </button>
      </div>
    </div>
  );
}

export default App;