class Cube {
    
    q;
    r;
    s;

    constructor(q,r,s) {
        this.q = q;
        this.r = r;
        this.s = s;
    }
}

cube_direction_vectors = [
    new Cube(0, -1, +1), //N
    new Cube(+1, -1, 0), //NE
    new Cube(+1, 0, -1), //SE
    new Cube(0, +1, -1), //S
    new Cube(-1, +1, 0), //SW
    new Cube(-1, 0, +1), //NW
];

const CubeDirection = Object.freeze({
    'N':{ordinal: 0, name:"N"},
    'NE':{ordinal:1, name:"NE"},
    'SE':{ordinal:2, name:"SE"},
    'S':{ordinal:3, name:"S"},
    'SW':{ordinal:4, name:"SW"},
    'NW':{ordinal:5, name:"NW"}
});

direction_right = function(cubeDirection) {
    let nextDir = cubeDirection.ordinal == 5 ? 0 : cubeDirection.ordinal +1;
    return Object.values(CubeDirection).find(cd => cd.ordinal == nextDir);
}

direction_left = function(cubeDirection) {
    let nextDir = cubeDirection.ordinal == 0 ? 5 : cubeDirection.ordinal -1;
    return Object.values(CubeDirection).find(cd => cd.ordinal == nextDir);
}

direction_difference_from_north = function(cubeDirection) {
    return CubeDirection['N'].ordinal + cubeDirection.ordinal;
}

direction_opposite = function(cubeDirection) {
    let nextDir = direction_left(cubeDirection);
    nextDir = direction_left(nextDir);
    nextDir = direction_left(nextDir);
    return Object.values(CubeDirection).find(cd => cd.ordinal == nextDir.ordinal);
}

direction_translate_to_offset_from_north = function(cubeDirection, referenceDirection) {
    let diff = direction_difference_from_north(referenceDirection);
    let newDirection = cubeDirection;
    for(let i = 0; i < diff; i++) {
        newDirection = direction_right(newDirection);
    }
    return newDirection;
}

cube_neighbors = function(cube) {
    return [cube_neighbor(cube,CubeDirection.N), 
            cube_neighbor(cube,CubeDirection.NE),
            cube_neighbor(cube,CubeDirection.SE),
            cube_neighbor(cube,CubeDirection.S),
            cube_neighbor(cube,CubeDirection.SW),
            cube_neighbor(cube,CubeDirection.NW)]
            .filter(c => c != null);
}

cube_neighbor = function(cube, direction) {
    return cube_add(cube, cube_direction_vectors[direction.ordinal]);
}

cube_add = function(cube, vector) {
    return new Cube(cube.q + vector.q, cube.r + vector.r, cube.s + vector.s)
}

cube_subtract = function(c1, c2) {
    return new Cube(c1.q - c2.q, c1.r - c2.r, c1.s - c2.s);
}

cube_matches = function(c1, c2) {
    if(!c1) return false;
    if(!c2) return false;
    return c1.q == c2.q && c1.r == c2.r && c1.s == c2.s;
}

cube_distance = function(c1, c2) {
    let dif = cube_subtract(c1, c2);
    return (Math.abs(dif.q) + Math.abs(dif.r) + Math.abs(dif.s)) / 2;
}

pos_distance = function(v1, v2) {
    return    v1.distanceTo(v2);
}

cube_direction = function(c1, c2) {
    let vec = cube_subtract(c1, c2);
    let norm = Math.sqrt(vec.q * vec.q + vec.r * vec.r + vec.s * vec.s);
    if(norm != null) {
        let dir = new Cube (Math.round(vec.q / norm), Math.round(vec.r / norm), Math.round(vec.s / norm))
        return cube_direction_vector_to_direction(dir, new Cube(vec.q/norm, vec.r/norm,vec.s/norm));

    }
}

cube_direction_vector_to_direction = function(normalizedVec, referenceVec) {
    for(let i = 0; i < cube_direction_vectors.length; i++) {
        if(cube_matches(normalizedVec, cube_direction_vectors[i])) {
            return Object.values(CubeDirection).find(cd => cd.ordinal == i);
        }
    }

    if(normalizedVec.q == 1) {
        if(Math.abs(referenceVec.s) > Math.abs(referenceVec.r)) {
            return CubeDirection['SE']
        }
        return CubeDirection['NE'];
    } else if(normalizedVec.q == -1) {
        if(Math.abs(referenceVec.s) > Math.abs(referenceVec.r)) {
            return CubeDirection['NW'];
        }
        return CubeDirection['SW']
    } else if(normalizedVec.r == 1) {
        if(Math.abs(referenceVec.q) > Math.abs(referenceVec.s)) {
            return CubeDirection['SW']
        }
        return CubeDirection['S'];
    } else if(normalizedVec.r == -1) {
        if(Math.abs(referenceVec.q) > Math.abs(referenceVec.s)) {
            return CubeDirection['NE'];
        }
        return CubeDirection['N'];
    } else if(normalizedVec.s == 1) {
        if(Math.abs(referenceVec.r) > Math.abs(referenceVec.q)) {
            return CubeDirection['N'];
        }
        return CubeDirection['NW'];
    } else {
        if(Math.abs(referenceVec.r) > Math.abs(referenceVec.q)) {
            return CubeDirection['S'];
        }
        return CubeDirection['SE'];
    }
}

mapCubeToPositionVector = function(hex, cube) {
    let size = hex.transform.size;

    let widthOffset = cube.q * (size.x*.75);
    let heightOffset = cube.r *(size.y * .5) + (cube.s * (size.y * .5) * -1);

    return new vector(hex.transform.position.x + widthOffset, hex.transform.position.y + heightOffset);
}