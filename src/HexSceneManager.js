class HexSceneManager {

    scene;

    centerHex;
    hoveredHex;
    selectedHex;

    hexMap = new Map();

    hexMapRanges = new Map(); // map of k=cube, v = {hex, dice}
    hexMapTargets = new Map(); // map of k = cube, v = {hex, dice}

    hexagonRed;
    hexagonGreen;
    hexagonYellow;
    hexagonGrey;
    hexagonWhite;
    hexagonDarkYellow;

    handleHover;
    handleClicked;

    contextWindowOpened = false;

    constructor(scene) {
        this.scene = scene;
    }

    /**Initialisation & image refreshing */

    init(state, selected) {
        this.hexagonWhite = this.scene.game.images.hexagon;
        this.hexagonRed = this.scene.game.images.hexagonRed;
        this.hexagonGreen = this.scene.game.images.hexagonGreen;
        this.hexagonGrey = this.scene.game.images.hexagonGrey;
        this.hexagonYellow = this.scene.game.images.hexagonYellow;
        this.hexagonDarkYellow = this.scene.game.images.hexagonDarkYellow;

        this.constructGrid(12);
        this.placeGrid();
        this.addGrid();
        this.reload(state, selected);
    }

    reload(state, selected) {
        if(selected.level == 'summon' || selected.level == 'action') {
            if(!(this.centerHex instanceof HexChar)) {
                this.replaceCenterHexBy(new HexChar(this.scene.width/2,this.scene.height/2,this.hexagonGreen, ()=> this.reload(state, selected)));
            }
        } else {
            if((this.centerHex instanceof HexChar)) {
                this.replaceCenterHexBy(new Hex(this.scene.width/2,this.scene.height/2,this.hexagonWhite));
            }
        }

        this.contextWindowOpened = false;
        this.hoveredHex = null;
        this.selectedHex = null;
        this.hexMapRanges.clear();
        this.hexMapTargets.clear();
        this.greyOut();

        this.addRangeHexes(selected.object);
        this.colorRangeHexes();
        this.initStateHandling(state, selected);
    }

    initStateHandling(state, selected) {
        if(state == 'VIEW') {
            this.handleHover = this.viewHoverHandler;
            this.handleClicked = null;
        } else if(state == 'EDIT_RANGE') {
            this.handleHover = this.editRangeHoverHandler;
            this.handleClicked = (mousePos) => this.editRangeClickHandler(mousePos, selected);
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
        this.hexMap.forEach((h,c) => {
            this.scene.addObject(h);
        })
    }

    greyOut() {
        this.hexMap.forEach((hex, cube) => {
            if(!(hex instanceof HexChar)) {
                hex.renderer.sprite = this.hexagonGrey;
            } else {
                hex.renderer.sprite = this.hexagonGreen;
            }
        });
    }

    /** Load valid target hexes */
    addRangeHexes(obj) {
        if(!obj || !obj.rangePattern) return;
        let rangePattern = obj.rangePattern;
        
        rangePattern.forEach(p => {
            let dice = p.dice;

            let translatedSource = p.source.map(d=> {
                let direction = CubeDirection[d];
                return direction_translate_to_offset_from_north(direction, this.centerHex.direction);
            });

            let cube = this.centerHex.cube;
            translatedSource.forEach(d => {
                cube = cube_neighbor(cube, d);
            });

            let hexTarget = getByKey(this.hexMap, cube);
            this.hexMapRanges.set(cube, {hex: hexTarget, dice: dice, source: p.source});
        });

        this.hexMapRanges.forEach((h,c) => {
            h.hex.renderer.sprite = this.hexagonWhite;
        })
    }

    colorRangeHexes() {
        this.hexMapRanges.forEach((h,cube) => {
            
            if(!(cube instanceof HexChar)) {
                h.hex.renderer.sprite = this.hexagonWhite;
            }

        })
    }

    /** Hover */

    //Maybe have updateHover as a variable func: depending on state 'update on hover' might mean something different
    //  i.e. hexMapRanges use is specific for hovering over range hexes. for select, will need all hexes.
    updateIfHovered(mousePos) {
        this.handleHover && this.handleHover.call(this, mousePos);
    }

    isWithin(testVector, centerVector, radius) {
        let distanceSq = (testVector.x - centerVector.x) * (testVector.x - centerVector.x) + 
        (testVector.y - centerVector.y) * (testVector.y - centerVector.y);
        
        return distanceSq <= radius * radius;
            
    }

    //Checks the json action pattern to map out the target hexes at the current hex (hovered)
    updateTargetHexes(hexSource) {
        let targetPattern = currentAction.get().targetPattern;
        let directionFromCenterToTarget = cube_direction(hexSource.cube, this.centerHex.cube);

        targetPattern.forEach(p => {
            let dice = p.dice;
            if(p.source.includes("SOURCE")) {
                this.hexMapTargets.set(hexSource.cube, {hex: hexSource, dice: dice});
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
            this.hexMapTargets.set(cube, {hex: hexTarget, dice:dice});
        })

        this.hexMapTargets.forEach((h,c) => {
            h.hex.renderer.sprite = this.hexagonRed;
        })
    }

    removeHexHovered() {
        if(!this.hoveredHex) {
            return;
        }
        this.resetColor(this.hoveredHex);

        this.hexMapTargets.forEach((h, c) => {
            if(getByKey(this.hexMapRanges, c)) {
                h.hex.renderer.sprite = this.hexagonWhite;
            } else {
                h.hex.renderer.sprite = this.hexagonGrey;
            }
        });
        this.hexMapTargets.clear();
        this.hoveredHex = null;
    }

    resetColor(hex) {
        if(!getKeyByNestedValue(this.hexMapRanges, hex, 'hex')) {
            if(!(hex instanceof HexChar)) {
                if(hex != this.selectedHex) {
                    hex.renderer.sprite = this.hexagonGrey;
                } else {
                    hex.renderer.sprite = this.hexagonDarkYellow;
                }
            }
        } else {
            if(!(hex instanceof HexChar)) {
                if(hex == this.selectedHex) {
                    hex.renderer.sprite = this.hexagonDarkYellow;
                } else {
                    hex.renderer.sprite = this.hexagonWhite;
                }
            }
        }
    }

    drawText(ctx) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        this.hexMapTargets.forEach((h, c) => {

            let dice;

            dice = h.dice ? h.dice : 
            getByKey(this.hexMapRanges, c) ? getByKey(this.hexMapRanges,c).dice : null ;

            if(dice) {
                ctx.fillText(dice, h.hex.transform.position.x, h.hex.transform.position.y + 7);
            }
        });

        ctx.font = "12px Arial";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        this.hexMapRanges.forEach((h, c) => {
            if(getByKey(this.hexMapTargets, c)) {
                return;
            }

            if(h.dice) {
                ctx.fillText(h.dice, h.hex.transform.position.x, h.hex.transform.position.y + 6);
            }
        });
    }

    updateIfClicked(mousePos) {
        this.handleClicked && this.handleClicked.call(this, mousePos);

    }

    viewHoverHandler(mousePos) {
        if(!mousePos) {
            this.removeHexHovered();
            return;
        }
        let found = null;

        for(let [k,h] of this.hexMapRanges) {
            if(this.isWithin(mousePos, h.hex.transform.position,h.hex.radius)) {
                found = true;
                if(h.hex !== this.hoveredHex) {
                    this.removeHexHovered();
                    this.hoveredHex = h.hex;


                    if(!cube_matches(getKeyByNestedValue(this.hexMapRanges, this.hoveredHex, 'hex'), this.centerHex.cube)) {
                        this.hoveredHex.renderer.sprite = this.hexagonYellow;
                    }
            
                    this.updateTargetHexes(this.hoveredHex);
                }
                break;
            }
        }

        if(!found) {
            this.removeHexHovered();
        }
    }

    editRangeHoverHandler(mousePos) {
        if(!mousePos) {
            this.removeHexHovered();
            return;
        }
        let found = null;

        for(let [k,h] of this.hexMap) {
            if(this.isWithin(mousePos, h.transform.position,h.radius)) {
                if(h instanceof HexChar) {
                    break;
                }
                found = true;
                if(h !== this.hoveredHex) {
                    this.removeHexHovered();
                    this.hoveredHex = h;

                    if(!(this.hoveredHex instanceof HexChar)) {
                        if(this.hoveredHex != this.selectedHex) {
                            this.hoveredHex.renderer.sprite = this.hexagonYellow;
                        }
                    }
                }
                break;
            }
        }

        if(!found) {
            this.removeHexHovered();
        }
    }

    editRangeClickHandler(mousePos, selectedObj) {    
        if(!this.hoveredHex) return;
        if(this.contextWindowOpened) return;

        let previousHex = this.selectedHex;

        this.selectedHex = this.hoveredHex;

        if(previousHex) {
            this.resetColor(previousHex);
        }

        this.selectedHex.renderer.sprite = this.hexagonDarkYellow;

        let hexData = {};
        hexData.hex = this.selectedHex;
        hexData.path = PathFinder.find(this.hoveredHex.cube, this.centerHex.cube, this.hexMap);

        let old = getByKey(this.hexMapRanges, this.selectedHex.cube);
        if(old) {
            hexData.oldPath = old.source;
            hexData.dice = old.dice;
        }

            if(selectedObj.level == 'action') {

            let tileScene = new AddTileScene(mousePos.x, mousePos.y, null, null, 200, 300);
            tileScene.callBack = (e) => this.saveRange(e, selectedObj);
            tileScene.closeCallBack = (hexData) => {
                this.selectedHex = null;
                this.contextWindowOpened = false;
                this.resetColor(hexData.hex);
            };

            this.scene.loadChildScene(tileScene);
            tileScene.init(hexData);

            this.contextWindowOpened = true;
        }
    }

    saveRange(hexData, selectedObj) {
        console.log(hexData);
        if(!hexData) return;
        if(hexData.mod) {
            if(hexData.mod.enabled == 'off') {
                let pattern = this.findEntryFromObject(hexData.path.map(p => p.name), selectedObj, 'rangePattern');
                if(pattern) {
                    selectedObj.object.rangePattern = selectedObj.object.rangePattern.filter(p => !(this.arrayEquals(p.source,pattern.source)));
                }
            } else {
                let pattern = this.findEntryFromObject(hexData.path.map(p => p.name), selectedObj, 'rangePattern');
                if(!pattern) {
                    pattern = {source: [], dice:null};
                    selectedObj.object.rangePattern.push(pattern);
                }
                pattern.source = hexData.path.map(p => p.name);
                pattern.dice = hexData.mod.dice;
                
            }
        }
        this.reload(state.state, selectedObj);
    }

    findEntryFromObject(val, obj, prop) {
        //prop = rangePattern, targetPattern
        //val = source[] sorted
        let patterns = obj.object[prop];
        if(!patterns || !patterns.length) {
            return [];
        } else {
            return patterns.find((p) => this.arrayEquals(p.source.toSorted(), val.toSorted()));
        }
    }

    arrayEquals(arr1, arr2) {
        return Array.isArray(arr1) &&
            Array.isArray(arr2) &&
            arr1.length === arr2.length &&
            arr1.every((val, index) => val === arr2[index]);
    }

    removeEntryFromObject(prop) {
        //prop = rangePattern, targetPattern

    }

}
