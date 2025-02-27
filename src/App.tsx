import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

// Define types
type Vector3 = [number, number, number];
type Colors = [string, string, string, string, string, string];
type CubeletData = {
  position: Vector3;
  colors: Colors;
};

// Individual cubelet face
interface CubeletFaceProps {
  position: Vector3;
  rotation: Vector3;
  color: string;
}

function CubeletFace({ position, rotation, color }: CubeletFaceProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.9, 0.9]} />
      <meshStandardMaterial color={color} side={2} />
    </mesh>
  );
}

// Cubelet with faces
interface CubeletProps {
  position: Vector3;
  colors: Colors;
}

function Cubelet({ position, colors }: CubeletProps) {
  const faces = useMemo(() => [
    // Right (+X)
    <CubeletFace key="right" position={[0.451, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={colors[0]} />,
    // Left (-X)
    <CubeletFace key="left" position={[-0.451, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color={colors[1]} />,
    // Top (+Y)
    <CubeletFace key="top" position={[0, 0.451, 0]} rotation={[-Math.PI / 2, 0, 0]} color={colors[2]} />,
    // Bottom (-Y)
    <CubeletFace key="bottom" position={[0, -0.451, 0]} rotation={[Math.PI / 2, 0, 0]} color={colors[3]} />,
    // Front (+Z)
    <CubeletFace key="front" position={[0, 0, 0.451]} rotation={[0, 0, 0]} color={colors[4]} />,
    // Back (-Z)
    <CubeletFace key="back" position={[0, 0, -0.451]} rotation={[0, Math.PI, 0]} color={colors[5]} />
  ], [colors]);

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

// Initialize cube state with positions and colors
function createInitialCubeState(): CubeletData[] {
  const state: CubeletData[] = [];
  const colors = {
    right: 'red',    // +X
    left: 'orange',  // -X
    top: 'yellow',   // +Y
    bottom: 'white', // -Y
    front: 'green',  // +Z
    back: 'blue',    // -Z
    inner: 'black'
  };

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (!(x === 0 && y === 0 && z === 0)) {
          const cubeColors: Colors = [
            x === 1 ? colors.right : colors.inner,
            x === -1 ? colors.left : colors.inner,
            y === 1 ? colors.top : colors.inner,
            y === -1 ? colors.bottom : colors.inner,
            z === 1 ? colors.front : colors.inner,
            z === -1 ? colors.back : colors.inner
          ];
          state.push({ position: [x, y, z], colors: cubeColors });
        }
      }
    }
  }
  return state;
}

// Rotate a face physically
function rotateFace(
  cubeState: CubeletData[],
  axis: 'x' | 'y' | 'z',
  layer: -1 | 1,
  clockwise: boolean
): CubeletData[] {
  const newState = cubeState.map(cube => ({ ...cube }));
  const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

  newState.forEach(cube => {
    const pos = cube.position;
    if (pos[axisIndex] === layer) {
      let newX = pos[0];
      let newY = pos[1];
      let newZ = pos[2];
      let newColors: Colors = [...cube.colors];

      if (axis === 'x') {
        if (clockwise) {
          newY = -pos[2];
          newZ = pos[1];
          [newColors[2], newColors[4], newColors[3], newColors[5]] =
            [newColors[5], newColors[2], newColors[4], newColors[3]];
        } else {
          newY = pos[2];
          newZ = -pos[1];
          [newColors[2], newColors[4], newColors[3], newColors[5]] =
            [newColors[4], newColors[3], newColors[5], newColors[2]];
        }
      } else if (axis === 'y') {
        if (clockwise) {
          newX = -pos[2];
          newZ = pos[0];
          [newColors[0], newColors[4], newColors[1], newColors[5]] =
            [newColors[5], newColors[0], newColors[4], newColors[1]];
        } else {
          newX = pos[2];
          newZ = -pos[0];
          [newColors[0], newColors[4], newColors[1], newColors[5]] =
            [newColors[4], newColors[1], newColors[5], newColors[0]];
        }
      } else { // z-axis
        if (clockwise) {
          newX = -pos[1];
          newY = pos[0];
          [newColors[0], newColors[2], newColors[1], newColors[3]] =
            [newColors[3], newColors[0], newColors[2], newColors[1]];
        } else {
          newX = pos[1];
          newY = -pos[0];
          [newColors[0], newColors[2], newColors[1], newColors[3]] =
            [newColors[2], newColors[1], newColors[3], newColors[0]];
        }
      }
      cube.position = [newX, newY, newZ];
      cube.colors = newColors;
    }
  });

  return newState;
}

interface RubiksCubeProps {
  scrambled: boolean;
  onScrambleComplete: () => void;
}

function RubiksCube({ scrambled, onScrambleComplete }: RubiksCubeProps) {
  const [cubeState, setCubeState] = useState<CubeletData[]>(createInitialCubeState);
  const scrambleInProgress = useRef<boolean>(false);

  const performRandomMove = () => {
    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    const layers: (-1 | 1)[] = [-1, 1];
    const randomAxis = axes[Math.floor(Math.random() * axes.length)];
    const randomLayer = layers[Math.floor(Math.random() * layers.length)];
    const clockwise = Math.random() > 0.5;

    setCubeState(prevState => rotateFace(prevState, randomAxis, randomLayer, clockwise));
  };

  useEffect(() => {
    let animationFrameId: number;
    let moveCount = 0;

    if (scrambled && !scrambleInProgress.current) {
      scrambleInProgress.current = true;
      moveCount = 0;

      const scrambleStep = () => {
        if (moveCount < 20) {
          performRandomMove();
          moveCount++;
          animationFrameId = requestAnimationFrame(scrambleStep);
        } else {
          scrambleInProgress.current = false;
          onScrambleComplete();
        }
      };

      animationFrameId = requestAnimationFrame(scrambleStep);
    }

    if (!scrambled) {
      setCubeState(createInitialCubeState());
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scrambled, onScrambleComplete]);

  const cubelets = useMemo(() => {
    return cubeState.map((cube, index) => (
      <Cubelet
        key={index}
        position={cube.position}
        colors={cube.colors}
      />
    ));
  }, [cubeState]);

  return (
    <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
      {cubelets}
    </group>
  );
}

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