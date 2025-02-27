import { useState, useEffect, useMemo, useRef } from 'react';
import { Cubelet } from './Cubelet';
import { CubeletData, createInitialCubeState, rotateFace } from '../utils/cubeUtils';

interface RubiksCubeProps {
    scrambled: boolean;
    onScrambleComplete: () => void;
}

export function RubiksCube({ scrambled, onScrambleComplete }: RubiksCubeProps) {
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