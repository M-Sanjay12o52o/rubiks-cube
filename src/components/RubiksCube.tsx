import { useMemo } from 'react';
import { Cubelet } from './Cubelet';
import { CubeletData } from '../utils/cubeUtils';

interface RubiksCubeProps {
    cubeState: CubeletData[];
    onRotateFace: (face: string, clockwise: boolean) => void; // Placeholder for compatibility
}

export function RubiksCube({ cubeState }: RubiksCubeProps) {
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