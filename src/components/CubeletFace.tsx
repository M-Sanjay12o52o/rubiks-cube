import { memo } from 'react';

type Vector3 = [number, number, number];

interface CubeletFaceProps {
    position: Vector3;
    rotation: Vector3;
    color: string;
}

export const CubeletFace = memo(({ position, rotation, color }: CubeletFaceProps) => {
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshStandardMaterial color={color} side={2} />
        </mesh>
    );
});