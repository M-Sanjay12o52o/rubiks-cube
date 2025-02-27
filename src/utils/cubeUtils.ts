export type Vector3 = [number, number, number];
export type Colors = [string, string, string, string, string, string];
export type CubeletData = {
    position: Vector3;
    colors: Colors;
};

export function createInitialCubeState(): CubeletData[] {
    const state: CubeletData[] = [];
    const colors = {
        right: 'red',
        left: 'orange',
        top: 'yellow',
        bottom: 'white',
        front: 'green',
        back: 'blue',
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

export function rotateFace(
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