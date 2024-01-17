class HexSceneManager {

    scene;

    centerHex;
    hoveredHex;

    hexMap = new Map();

    hexMapRanges = new Map();
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
        if(!currentAction) {
            this.replaceCenterHexBy(new Hex(this.scene.width/2,this.scene.height/2,this.hexagonWhite));
        }

        this.hoveredHex = null;
        this.hexMapRanges.clear();
        this.hexMapTargets.clear();
        this.greyOut();

        if(currentAction) {
            if(!(this.centerHex instanceof HexChar)) {
                this.replaceCenterHexBy(new HexChar(this.scene.width/2,this.scene.height/2,this.hexagonGreen, ()=> this.loadForOrientation()));
            }
            this.addValidHexes();
            this.colorValidHexes();
        }
    }

    replaceCenterHexBy(hex) {
        let cubeZero = getByValue(this.hexMap, this.centerHex);
        this.centerHex.cube = cubeZero;
        this.centerHex.destroy();

        this.centerHex = hex;
        this.centerHex.cube = cubeZero;
        this.setHexPositionData(this.centerHex, cubeZero);
        this.hexMap.set(cubeZero, this.centerHex);
        this.scene.addObject(this.centerHex);
    }

    constructGrid(amount) {

        let cubeZero = new Cube(0,0,0);

        this.centerHex =  new Hex(this.scene.width/2,this.scene.height/2,this.hexagonWhite);
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
            this.setHexPositionData(hex, cube);
        });
    }

    setHexPositionData(hex, cube) {
        let size = hex.transform.size;
        let v = mapCubeToPositionVector(hex,cube);
        hex.transform.position = v;
        hex.radius = Math.sqrt(3)/2 * ((hex.transform.position.x + size.x / 4) - (hex.transform.position.x - size.x / 4));
    }

    addGrid() {
        this.hexMap.forEach((h,k) => {
            this.scene.addObject(h);
        })
    }

    greyOut() {
        this.hexMap.forEach((hex, cube) => {
            if(currentAction) {
                if(!cube_matches(cube, new Cube(0,0,0))) {
                    hex.renderer.sprite = this.hexagonGrey;
                } else {
                    hex.renderer.sprite = this.hexagonGreen;
                }
            } else {
                hex.renderer.sprite = this.hexagonGrey;
            }
        });
    }

    /** Load valid target hexes */

    // Reads json and for a given rangeOfVision, marks hexes in those directions (& potentially diagonals)
    addValidHexes() {
        let rangePattern = currentAction.rangePattern;
        rangePattern.forEach(p => {

            let translatedSource = p.source.map(d=> {

                let direction = CubeDirection[d];
                return direction_translate_to_offset_from_north(direction, this.centerHex.direction);
            });

            let cube = this.centerHex.cube;
            translatedSource.forEach(d => {
                cube = cube_neighbor(cube, d);
            });

            let hexTarget = getByKey(this.hexMap, cube);
            this.hexMapRanges.set(cube, hexTarget);
        })

        this.hexMapRanges.forEach((h,c) => {
            h.renderer.sprite = this.hexagonWhite;
        })
    }

    colorValidHexes() {
        this.hexMapRanges.forEach((hex,cube) => {
            
            if(!cube_matches(hex.cube, new Cube(0,0,0))) {
                hex.renderer.sprite = this.hexagonWhite;
            }

        })
    }

    /** Hover */

    updateIfHovered(mousePos) {
    let found = null;

        for(let [k,h] of this.hexMapRanges) {
            if(this.isWithin(mousePos, h.transform.position,h.radius)) {
                found = true;
                if(h !== this.hoveredHex) {
                    this.updateHexHovered(h);
                        cube_distance(
                            getByValue(this.hexMapRanges, h),
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
        if(!cube_matches(getByValue(this.hexMapRanges, this.hoveredHex), new Cube(0,0,0))) {
            this.hoveredHex.renderer.sprite = this.hexagonYellow;
        }

        //if view is selected
        this.updateTargetHexes(this.hoveredHex);

    }

    //Checks the json action pattern to map out the target hexes at the current hex (hovered)
    updateTargetHexes(hexSource) {
        let targetPattern = currentAction.targetPattern;
        let directionFromCenterToTarget = cube_direction(hexSource.cube, this.centerHex.cube);

        targetPattern.forEach(p => {
            if(p.source.includes("SOURCE")) {
                this.hexMapTargets.set(hexSource.cube, hexSource);
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
        if(!cube_matches(getByValue(this.hexMapRanges, this.hoveredHex), new Cube(0,0,0))) {
            this.hoveredHex.renderer.sprite = this.hexagonWhite;
        }

        this.loadForOrientation();
    }
}
