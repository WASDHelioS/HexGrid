class HexSceneManager {

    scene;

    centerHex;
    hoveredHex;

    hexMap = new Map();

    hexMapValidTargets = new Map();
    hexMapTargets = new Map();

    hexagonRed;
    hexagonGreen;
    hexagonYellow;
    hexagonGrey;
    hexagonWhite;

    constructor(scene) {
        this.scene = scene;
    }

    /**Initialisation & image refreshing */

    init() {
        this.hexagonWhite = this.scene.game.images.hexagon;
        this.hexagonRed = this.scene.game.images.hexagonRed;
        this.hexagonGreen = this.scene.game.images.hexagonGreen;
        this.hexagonGrey = this.scene.game.images.hexagonGrey;
        this.hexagonYellow = this.scene.game.images.hexagonYellow;

        this.constructGrid(12);
        this.placeGrid();
        this.addGrid();
        this.loadForOrientation();
    }

    loadForOrientation() {
        this.hoveredHex = null;
        this.hexMapValidTargets.clear();
        this.hexMapTargets.clear();
        this.greyOut();

        if(currentAction) {
            this.addValidHexes();
            this.colorValidHexes();
        }
    }

    constructGrid(amount) {

        let cubeZero = new Cube(0,0,0);

        this.centerHex =  new HexChar(this.scene.width/2,this.scene.height/2,this.hexagonGreen, ()=> this.loadForOrientation());
        this.centerHex.cube = cubeZero;

        this.hexMap.set(cubeZero, this.centerHex);

        let rowStart = cubeZero;

        let dir = CubeDirection["N"];

        rowStart = cube_neighbor(rowStart, dir);
        let currentCube = rowStart;

        for(let i = 1; i < amount; i++) {
            currentCube = this.moveAndCreate(currentCube, CubeDirection["SW"], i);
            currentCube = this.moveAndCreate(currentCube, CubeDirection["S"], i);
            currentCube = this.moveAndCreate(currentCube, CubeDirection["SE"], i);
            currentCube = this.moveAndCreate(currentCube, CubeDirection["NE"], i);
            currentCube = this.moveAndCreate(currentCube, CubeDirection["N"], i);
            currentCube = this.moveAndCreate(currentCube, CubeDirection["NW"], i);
            currentCube = cube_neighbor(currentCube, CubeDirection["N"]);
        }

        
    }

    //Moves a cube in a direction and creates a new hex at those coords.
    moveAndCreate(cube, direction, amount) {
        for(let i = 0 ; i < amount; i++) {
            cube = cube_neighbor(cube, direction);
            
            let hex = new Hex(this.scene.width/2,this.scene.height/2,this.hexagonWhite);
            hex.cube = cube;
            this.hexMap.set(cube, hex);
        }

        return cube;
    }

    //transforms cube positions to x-y coordinates and sets
    placeGrid() {
        this.hexMap.forEach((hex,cube) => {
            let size = hex.transform.size;

            let v = mapCubeToPositionVector(hex,cube);

            hex.transform.position = v;

            hex.radius = Math.sqrt(3)/2 * ((hex.transform.position.x + size.x / 4) - (hex.transform.position.x - size.x / 4));
        })
    }

    addGrid() {
        this.hexMap.forEach((h,k) => {
            this.scene.addObject(h);
        })
    }

    greyOut() {
        this.hexMap.forEach((hex, cube) => {

            if(!cube_matches(cube, new Cube(0,0,0))) {
                hex.renderer.sprite = this.hexagonGrey;
            } else {
                hex.renderer.sprite = this.hexagonGreen;
            }
        });
    }

    /** Load valid target hexes */

    // Reads json and for a given rangeOfVision, marks hexes in those directions (& potentially diagonals)
    addValidHexes() {
        let maxDistance = currentAction.distanceMax;
        let minDistance = currentAction.distanceMin;
        if(!minDistance) {
            minDistance = 0;
        }
        if(!maxDistance) {
            maxDistance = 10;
        }

        let directions = range_of_vision[currentAction.rangeOfVision];

        let diagonal = currentAction.diagonalVision;

        directions.forEach(dir => {

            let direction = CubeDirection[dir];
            let rotatedDirection = direction_translate_to_offset_from_north(direction, this.centerHex.direction);

            for(let i = minDistance; i <= maxDistance; i++) {
                let hex = this.traverse(this.centerHex, rotatedDirection, i);

                this.hexMapValidTargets.set(hex.cube, hex);

                if(diagonal && diagonal == 'OUT') {
                    for(let j = 1; j < i; j++) {

                        let hexLeft = this.traverse(hex,direction_left(direction_left(rotatedDirection)), j);
                        let hexRight = this.traverse(hex, direction_right(direction_right(rotatedDirection)), j);

                        this.hexMapValidTargets.set(hexLeft.cube, hexLeft);
                        this.hexMapValidTargets.set(hexRight.cube, hexRight);
                    }
                }

                if(diagonal && diagonal == 'IN') {
                    for(let j = 1; j < i; j++) {
                        if(direction.name.includes('W')) {
                            let hexRight = this.traverse(hex, direction_right(direction_right(rotatedDirection)), j);
                            this.hexMapValidTargets.set(hexRight.cube, hexRight);
                        } else if(direction.name.includes('E')) {
                            let hexLeft = this.traverse(hex,direction_left(direction_left(rotatedDirection)), j);
                            this.hexMapValidTargets.set(hexLeft.cube, hexLeft);
                        }
                    }
                }
            }
        })
    }

    //Moves from one hex, into a direction for a given amount of steps. returns destination hex
    traverse(hex, direction, steps) {
        let cube = hex.cube;

        for(let i = 0; i < steps; i++) {
            cube = cube_neighbor(cube, direction);
        }

        return getByKey(this.hexMap, cube);
    }

    colorValidHexes() {
        this.hexMapValidTargets.forEach((hex,cube) => {
            
            if(!cube_matches(hex.cube, new Cube(0,0,0))) {
                hex.renderer.sprite = this.hexagonWhite;
            }

        })
    }

    /** Hover */

    updateIfHovered(mousePos) {
    let found = null;

        for(let [k,h] of this.hexMapValidTargets) {
            if(this.isWithin(mousePos, h.transform.position,h.radius)) {
                found = true;
                if(h !== this.hoveredHex) {
                    this.updateHexHovered(h);
                        cube_distance(
                            getByValue(this.hexMapValidTargets, h),
                            new Cube(0,0,0)
                    );
                }
                break;
            }
        }

        if(!found && this.hoveredHex) {
            this.removeHexHovered();
        }
    }

    isWithin(testVector, centerVector, radius) {
        let distanceSq = (testVector.x - centerVector.x) * (testVector.x - centerVector.x) + 
        (testVector.y - centerVector.y) * (testVector.y - centerVector.y);
        
        return distanceSq <= radius * radius;
            
    }

    updateHexHovered(detectedHex) {
        if(this.hoveredHex) {
            this.removeHexHovered();
        }
        this.hoveredHex = detectedHex;
        if(!cube_matches(getByValue(this.hexMapValidTargets, this.hoveredHex), new Cube(0,0,0))) {
            this.hoveredHex.renderer.sprite = this.hexagonYellow;
        }

        //if view is selected
        this.updateTargetHexes(this.hoveredHex);

    }

    //Checks the json action pattern to map out the target hexes at the current hex (hovered)
    updateTargetHexes(hexSource) {
        let pattern = currentAction.pattern;
        let directionFromCenterToTarget = cube_direction(hexSource.cube, this.centerHex.cube);

        pattern.forEach(p => {
            if(p.source.includes("SOURCE")) {

                return;
            }
            let translatedSource = p.source.map(d=> {
                
                let direction = CubeDirection[d];
                return direction_translate_to_offset_from_north(direction, directionFromCenterToTarget);
            });

            let cube = hexSource.cube;
            translatedSource.forEach(d => {
                cube = cube_neighbor(cube, d);
            });

            let hexTarget = getByKey(this.hexMap, cube);
            this.hexMapTargets.set(cube, hexTarget);
        })

        this.hexMapTargets.forEach((h,c) => {
            h.renderer.sprite = this.hexagonRed;
        })
    }

    removeHexHovered() {
        if(!cube_matches(getByValue(this.hexMapValidTargets, this.hoveredHex), new Cube(0,0,0))) {
            this.hoveredHex.renderer.sprite = this.hexagonWhite;
        }

        this.loadForOrientation();
    }
}
