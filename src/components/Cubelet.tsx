import { useMemo } from 'react';
import { CubeletFace } from './CubeletFace';

type Vector3 = [number, number, number];
type Colors = [string, string, string, string, string, string];

interface CubeletProps {
    position: Vector3;
    colors: Colors;
}

export function Cubelet({ position, colors }: CubeletProps) {
    const faces = useMemo(() => [
        <CubeletFace key="right" position={[0.451, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={colors[0]} />,
        <CubeletFace key="left" position={[-0.451, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color={colors[1]} />,
        <CubeletFace key="top" position={[0, 0.451, 0]} rotation={[-Math.PI / 2, 0, 0]} color={colors[2]} />,
        <CubeletFace key="bottom" position={[0, -0.451, 0]} rotation={[Math.PI / 2, 0, 0]} color={colors[3]} />,
        <CubeletFace key="front" position={[0, 0, 0.451]} rotation={[0, 0, 0]} color={colors[4]} />,
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