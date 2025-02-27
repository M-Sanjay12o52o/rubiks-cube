import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { RubiksCube } from './components/RubiksCube';
import './App.css';

function App() {
  const [scrambled, setScrambled] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);

  const handleScramble = () => {
    if (!isScrambling) {
      setIsScrambling(true);
      setScrambled(true);
    }
  };

  const handleScrambleComplete = () => {
    setIsScrambling(false);
  };

  const handleReset = () => {
    setScrambled(false);
    setIsScrambling(false);
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
        <RubiksCube scrambled={scrambled} onScrambleComplete={handleScrambleComplete} />
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
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
            cursor: isScrambling ? 'not-allowed' : 'pointer'
          }}
        >
          {isScrambling ? 'Scrambling...' : 'Scramble Cube'}
        </button>

        <button
          onClick={handleReset}
          disabled={!scrambled || isScrambling}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: (!scrambled || isScrambling) ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!scrambled || isScrambling) ? 'not-allowed' : 'pointer'
          }}
        >
          Reset Cube
        </button>
      </div>
    </div>
  );
}

export default App;