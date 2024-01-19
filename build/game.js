
/*
 * Start File:
 * ./src/backgroundScene.js
 */ 
class BackgroundScene extends Scene
{
    drawn = false;

    constructor (x, y, width, height, displayMode = 0)
    {
        super(x, y, width, height, displayMode);
    }

    draw ()
    {
        if (!this.drawn)
        {
            super.draw();
            this.drawn = true;
        }
    }
}
/*
 * End File:
 * ./src/backgroundScene.js
 */ 

/*
 * Start File:
 * ./src/game.js
 */ 
var game = new Game();

var state;

var summoners;
var currentSummoner = {
    cs: null,
    signal: new Signal(),
    get: function() {
        return this.cs;
    },
    set: function(cs) {
        shouldDispatch = cs !== null
        this.cs = cs;
        if(shouldDispatch) this.signal.dispatch(this.cs);
    }
};
var currentSummon = {
    cs: null,
    signal: new Signal(),
    get: function() {
        return this.cs;
    },
    set: function(cs) {
        shouldDispatch = cs !== null
        this.cs = cs;
        if(shouldDispatch) this.signal.dispatch(this.cs);
    }
};
var currentAction = {
    ca: null,
    signal: new Signal(),
    get: function() {
        return this.ca;
    },
    set: function(ca) {
        shouldDispatch = ca !== null
        this.ca = ca;
        if(shouldDispatch) this.signal.dispatch(this.ca);
    }
};
var currentState = {
    cs: null,
    signal: new Signal(),
    get: function() {
        return this.cs;
    },
    set: function(cs) {
        shouldDispatch = cs !== null
        this.cs = cs;
        if(shouldDispatch) this.signal.dispatch(this.cs);
    }
};

var scene;

document.ondblclick = function(e) {
    e.preventDefault();
}

window.onload = function ()
{
    this.game.preloadImagesThenStart(
        [
            { name: "hexagon", url: "images/hexagon.png" },
            { name: "hexagonGreen", url: "images/hexagonGreen.png" },
            { name: "hexagonGrey", url: "images/hexagonGrey.png" },
            { name: "hexagonRed", url: "images/hexagonRed.png" },
            { name: "hexagonOrange", url: "images/hexagonOrange.png" },
            { name: "hexagonYellow", url: "images/hexagonYellow.png" },
            { name: "hexagonDarkYellow", url: "images/hexagonDarkYellow.png"},

            { name: "button", url: "images/buttons.png", subImgTotal: 5, perRow: 1},
            { name: "buttonX", url: "images/buttonsX.png", subImgTotal: 3, perRow: 1},
            { name: "buttonLeft", url: "images/buttonsLeft.png", subImgTotal: 3, perRow: 1},
            { name: "buttonRight", url: "images/buttonsRight.png", subImgTotal: 3, perRow: 1},
            { name: "radioOn", url: "images/radioOn.png"},
            { name: "radioOff", url: "images/radioOff.png"},

            { name: "input", url: "images/input.png"},
        ]
        , function ()
        {
            this.preloadJsonThenStart("./patterns.json", function() {
                state = new StateManager();

                currentSummoner.signal.add((summoner) => { state.updateState("VIEW"); state.updateSelected('summoner', summoner[0]); }, state);
                currentSummon.signal.add((summon) => { state.updateState("VIEW"); state.updateSelected('summon', summon[0]); }, state);
                currentAction.signal.add((action) => { state.updateState("VIEW"); state.updateSelected('action', action[0]); }, state);
                currentState.signal.add((s) => { state.updateState(s[0]);}, state);

                this.createMainScene(game);
            })
        });
};

createMainScene = function (game)
{
    scene = new HexScene(10, 10, 900, 800, Scene.DisplayModes.absolute);

    this.game.loadScene(scene);

    scene.init(state.state, state.selected);

    selectedScene = new SelectedScene(10,10, 900, 50);

    menuScene = new SelectMenuMainScene(0, 100,-170,100, 200, 600);


    scene.loadChildScene(selectedScene);
    scene.loadChildScene(menuScene);
    menuScene.init();

    readAndApplyQueryParams();

    console.log("Game started!");
};

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value && value === searchValue)
            return key;
    }
    return null;
}

function getKeyByNestedValue(map, searchValue, prop) {
    for(let [key,value] of map.entries()) {
        if(value[prop] && value[prop] === searchValue) {
            return key;
        }
    }
    return null;
}

function getByKey(map, searchValue) {
    for(let [key, value] of map.entries()) {
        if(cube_matches(key,searchValue)) {
            return value;
        }
    }
    return null;
}

function onCreateSummoner() {
    let newSummoner = {};
    newSummoner.get().id = nextId(summoners);
    newSummoner.get().name = "";
    newSummoner.get().summons = [];

    summoners.push(newSummoner);

    document.getElementById("selectSummoner").value = newSummoner.id;

    currentSummoner.set(newSummoner);

    populateSummonerData(newSummoner.id);
    onSelectSummoner();
}

function onUpdateSummoner() {
    currentSummoner.get().name = document.getElementById("summonerName").value;
    populateSummonerData(currentSummoner.get().id);
    onSelectSummoner();
}

function onDeleteSummoner() {

}

function onSelectSummon() {    
    currentAction.set(null);
    document.getElementById("actionSelectDiv").hidden = true;
    document.getElementById("actionDetailDiv").hidden = true;
    scene.load();

    let id = document.getElementById("selectSummon").value;
    currentSummon.set(currentSummoner.get().summons.find(item => item.id == id));

    document.getElementById("summonDetailDiv").hidden = false;

    document.getElementById("summonName").value = currentSummon.get().name;

    document.getElementById("actionSelectDiv").hidden = false;
    selectAction = document.getElementById("selectAction");
    selectAction.innerHTML = "";

    for(let action of currentSummon.get().actions) {
        let option = document.createElement('option');
        option.value = action.id;
        option.text = action.name;
        selectAction.add(option);
    }
}

function onCreateSummon() {
    scene.load();
    let newSummon = {};
    newSummon.id = nextId(currentSummoner.get().summons);
    newSummon.name = "";
    newSummon.actions = [];

    currentSummoner.get().summons.push(newSummon);

    document.getElementById("selectSummon").value = newSummon.id;

    currentSumon = newSummon;

    populateSummonData(newSummon.id);
    onSelectSummon();
}

function onUpdateSummon() {
    currentSummon.get().name = document.getElementById("summonName").value;
    populateSummonData(currentSummon.get().id);
    onSelectSummon();
}

function onDeleteSummon() {

}

function onCreateAction() {

}

function onUpdateAction() {

}

function onDeleteAction() {

}


function toJson() {
    let newTab = window.open();
    let fullschema = {summoners: summoners}
    newTab.document.write("<html><body><pre>" +  JSON.stringify(fullschema, null, 4) + "</pre></body></html>");
    newTab.document.close();
}

async function preloadJsonThenStart (location, onComplete)
{
    const cont = async () =>
    {
        await $.getJSON(location, function(obj) {
            summoners = obj.summoners;
            });
        onComplete && onComplete();
    };

    cont.apply();
}

function nextId(obj) {
    let highest = 0;
    for(let item of obj) {
        if(item.id > highest) {
            highest = item.id;
        }
    }

    return highest + 1;
}

function readAndApplyQueryParams() {
    let queryParamsMap = parseQueryParams(window.location.search);

    queryParamsMap.forEach(strArr => {
        switch(strArr[0]){
            case "summoner":
                currentSummoner.set(summoners.find(summ => summ.id == strArr[1]));
                return;
            case "summon":
                currentSummon.set(currentSummoner.get().summons.find(summ => summ.id == strArr[1]));
                return;
            case "action":
                currentAction.set(currentSummon.get().actions.find(act => act.id == strArr[1]));
                return;
        }
    });
}

function parseQueryParams(qs) {
    return qs.
      replace(/^\?/, '').
      split('&').
      map(str => str.split('=').map(v => decodeURIComponent(v)));
}

function updateQueryParams(str) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' +str;
    window.history.replaceState({path: newurl}, "", newurl);
}
/*
 * End File:
 * ./src/game.js
 */ 

/*
 * Start File:
 * ./src/HexScene.js
 */ 
class HexScene extends Scene
{

    a = (2 * Math.PI / 6);
    r = 50;

    x;
    y;
    width;
    height;

    hexSceneManager;

    constructor (x, y, width, height, displayMode = 0)
    {
        super(x, y, width, height, displayMode);        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.renderBackground = false;


        this.hexSceneManager = new HexSceneManager(this);
    }

    init(state, selected) {
        this.hexSceneManager.init(state, selected);
    }

    load(state, selected) {
        this.hexSceneManager.reload(state, selected);
    }

    update (deltaTime)
    {
        super.update(deltaTime);
        this.detectMouse();
    }

    draw ()
    {
        super.draw();

        this.hexSceneManager.drawText(this.cv_context);
    }

    detectMouse() {
        if(!GameInput.mousePosition) {
            return;
        }

        let isWithinScene = this.game.activeScenes.filter(scene => scene !== this).find(scene => scene.isWithin());
        if(isWithinScene) {
            this.hexSceneManager.updateIfHovered(null);
            return;
        }

        let mousePos = this.getRelativeMousePos();

        this.hexSceneManager.updateIfHovered(mousePos);

        let btn = GameInput.mousePressed();
        if(btn && btn.left) {
            this.hexSceneManager.updateIfClicked(mousePos);
        }
    }

    onUpdateSelected(selected) {
        this.load(state.state, selected)
        if(selected.level == 'summoner') {
            let editScene = game.activeScenes.find(s => s instanceof EditMenuMainScene);
            if(editScene) {
                editScene.hide();
            }
        }

        else {
            let editScene = game.activeScenes.find(s => s instanceof EditMenuMainScene);
            if(!editScene) {
                editScene = new EditMenuMainScene(this.width - 200 + this.x, 100, this.width - 25,100, 200, 200, this.width + this.x, this.height + this.y);
                this.loadChildScene(editScene);
                editScene.init(selected);
            } else {
                editScene.show();
            }
            //after modify buttons depending on level (let the scene handle that) (so we can update the existing scene too)
        }
    }

    onUpdateState(st) {
        this.load(st, state.selected);

    }
}
/*
 * End File:
 * ./src/HexScene.js
 */ 

/*
 * Start File:
 * ./src/HexSceneManager.js
 */ 
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

/*
 * End File:
 * ./src/HexSceneManager.js
 */ 

/*
 * Start File:
 * ./src/menus/SelectedScene.js
 */ 
class SelectedScene extends Scene {

    constructor(x,y,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();

        //todo: change these into GameObject and update state onClick.

        if(currentSummoner.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText("Summoner : " + currentSummoner.get().name, 0, this.height / 2);
        }

        if(currentSummon.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Summon : " + currentSummon.get().name, this.width / 2, this.height / 2);
        }

        if(currentAction.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText("Action : " + currentAction.get().name, this.width, this.height / 2);
        }
    }

    onUpdateSelected(selected) {

    }

    onUpdateState(st) {
        
    }
}
/*
 * End File:
 * ./src/menus/SelectedScene.js
 */ 

/*
 * Start File:
 * ./src/menus/SelectMenuMainScene.js
 */ 
class SelectMenuMainScene extends Scene {

    targetPosition;
    originPosition;
    activeTween;

    x;
    y;
    width;
    height;

    buttonGroups = [];
    collapsed = false;
    activeButton;

    constructor(x,y,dx,dy,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.width = width;
        this.height = height;

        this.originPosition = new vector(x,y);
        this.targetPosition = new vector(dx,dy)
    }

    init() {
        this.addHierarchyButtons();
        this.addImportButton();
        this.addExportButton();
        this.addResetButton();
        this.addCollapseButton();
    }

    addHierarchyButtons() {
        let summonerButton = new Button(80,100, this.game.images.button);
        let summonButton = new Button(80, 150, this.game.images.button);
        let actionButton = new Button(80, 200, this.game.images.button);

        summonerButton.transform.scale = new vector(0.8,1);
        summonerButton.setName("Summoners");
        summonerButton.textSize = 14;
        
        summonButton.transform.scale = new vector(0.8, 1);
        if(!currentSummoner.get()) {
            summonButton.selectable = false;
        }
        summonButton.setName("Summons");
        summonButton.textSize = 14;

        actionButton.transform.scale = new vector(0.8, 1);
        if(!currentSummon.get()) {
            actionButton.selectable = false;
        }
        actionButton.setName("Actions");
        actionButton.textSize = 14;

        this.addObject(summonerButton);
        this.addObject(summonButton);
        this.addObject(actionButton);

        let buttonGroup = new ButtonGroup();

        buttonGroup.addButton(summonerButton);
        buttonGroup.addButton(summonButton);
        buttonGroup.addButton(actionButton);

        summonerButton.clicked = (btn) => { 
            this.clearChildScenes();
            this.activeButton = btn;
            let scene = new SelectMenuSubScene(225, 100, null,null, 450 ,250, btn);

            scene.callBack = (scene) => {
                currentAction.set(null);
                currentSummon.set(null);
                currentSummoner.set(scene.selected);
            };

            this.loadChildScene(scene);
            scene.init(summoners, "summoner");
            buttonGroup.manageSelect(btn);
        };

        summonerButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        summonButton.clicked = (btn) => { 
            this.clearChildScenes(); 
            this.activeButton = btn;
            let scene = new SelectMenuSubScene(225, 100,null,null, 450 ,250, btn);

            scene.callBack = (scene) => {
                currentAction.set(null);
                currentSummon.set(scene.selected);
            };

            this.loadChildScene(scene);
            scene.init(currentSummoner.get().summons, "summon");
            buttonGroup.manageSelect(btn);
        };

        summonButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        actionButton.clicked = (btn) => { 
            this.clearChildScenes(); 
            this.activeButton = btn;
            let scene = new SelectMenuSubScene(225, 100,null,null, 450 ,250, btn);

            scene.callBack = (scene) => {
                currentAction.set(scene.selected);
            };

            this.loadChildScene(scene);
            scene.init(currentSummon.get().actions, "action");
            buttonGroup.manageSelect(btn); 
        };

        actionButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        this.buttonGroups.push(buttonGroup);
    }

    addImportButton() {
        let importButton = new Button(80, this.height - 80, this.game.images.button);

        importButton.transform.scale = new vector(0.4, 0.4);
        importButton.setName("Import");

        this.addObject(importButton);

        let importButtonGroup = new ButtonGroup();
        importButton.clicked = (btn) => {
            // import
        }
        importButton.held = (btn) => {
            importButtonGroup.held(btn);
        }
        importButtonGroup.addButton(importButton);

        this.buttonGroups.push(importButtonGroup);
    }

    addExportButton() {
        let exportButton = new Button(80, this.height - 60, this.game.images.button);

        exportButton.transform.scale = new vector(0.4, 0.4);
        exportButton.setName("Export");

        this.addObject(exportButton);

        let exportButtonGroup = new ButtonGroup();
        exportButton.clicked = (btn) => {
            toJson();
        }
        exportButton.held = (btn) => {
            exportButtonGroup.held(btn);
        }
        exportButtonGroup.addButton(exportButton);

        this.buttonGroups.push(exportButtonGroup);
    }

    addResetButton() {
        let resetButton = new Button(80, this.height - 40, this.game.images.button);

        resetButton.transform.scale = new vector(0.4, 0.4);
        resetButton.setName("Reset");

        this.addObject(resetButton);

        let resetButtonGroup = new ButtonGroup();
        resetButton.clicked = (btn) => {
            // import
        }
        resetButton.held = (btn) => {
            resetButtonGroup.held(btn);
        }
        resetButtonGroup.addButton(resetButton);

        this.buttonGroups.push(resetButtonGroup);
    }

    update(deltaTime) {
        super.update(deltaTime);

        this.handleMouse();        
    }

    handleMouse() {
        if(!GameInput.mousePosition) {
            return;
        }

        let translatedMousePos = new vector(GameInput.mousePosition.x - this.position.x, GameInput.mousePosition.y-this.position.y);

        if(translatedMousePos.x < -100 || translatedMousePos.y < -100 || translatedMousePos.x > this.size.x + 100 || translatedMousePos.y > this.size.y + 100) {
            return;
        }

        if(GameInput.mouseHeld().left) {
            return;
        }

        this.buttonGroups.forEach(bg => bg.hover(translatedMousePos));
    }


    addCloseButton() {
        let buttonGroup = new ButtonGroup();

        let xButton = new Button(0,0, this.game.images.buttonX);
        xButton.transform.scale = new vector(.6,.6);
        xButton.transform.position = new vector(this.width - xButton.transform.size.x/2, xButton.transform.size.y/2);
        xButton.held = (btn) => {
            buttonGroup.held(btn);

            this.close();
        };

        this.addObject(xButton);

        buttonGroup.addButton(xButton);

        this.buttonGroups.push(buttonGroup);
    }

    close() {
        this.originBtn.selected = false;
        this.originBtn.renderer.subImage = 0;
        this.destroy();
    }

    addCollapseButton() {
        let buttonGroup = new ButtonGroup();
        buttonGroup.name="collapse";

        let collapseButton = new Button(0,0, this.game.images.buttonLeft);
        collapseButton.transform.scale = new vector(.6,.6);
        collapseButton.transform.position = new vector(this.width - collapseButton.transform.size.x/2, collapseButton.transform.size.y/2);
        
        collapseButton.held = (btn) => {
            buttonGroup.held(btn);
        };

        collapseButton.clicked = (btn) => {

            this.collapse(btn);
        }

        this.addObject(collapseButton);
        buttonGroup.addButton(collapseButton);
        this.buttonGroups.push(buttonGroup);
    }

    collapse(btn) {
        this.createTween(this.determineVector() ,800, null, this).start();
        this.flipCollapseButton(btn);
        this.collapsed = this.toggle(this.collapsed);
        this.getChildScenes().forEach(scene => scene.close());
    }

    toggle(bool) {
        return !bool;
    }

    determineVector() {
        if(this.collapsed) {
            return this.originPosition;
        } else {
            return this.targetPosition;
        }
    }

    flipCollapseButton(btn) {
        if(btn.renderer.sprite == this.game.images.buttonRight) {
            btn.renderer.sprite = this.game.images.buttonLeft;
        } else {
            btn.renderer.sprite = this.game.images.buttonRight;
        }
    }

    createTween (target, time, onDone, context)
    {
        let tween = new TWEEN.Tween(context.position)
            .to({ x: target.x, y: target.y }, time)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { context.activeTween = null; onDone && onDone.call(context); });
        return tween.onStart(() => context.stopActiveTween(tween));
    }

    stopActiveTween (tween)
    {
        if (this.activeTween) 
        {
            this.activeTween.stop();
        }
        this.activeTween = tween;
    }

    onUpdateSelected(selected) {
        if(this.activeButton) {
            this.activeButton.selected = false;
            this.activeButton.renderer.subImage = 0;
            this.activeButton = null;
        }

        if(selected.level == 'summoner') {
            let summonButton = this.buttonGroups[0].findByName('Summons');
            let actionButton = this.buttonGroups[0].findByName('Actions');

            summonButton.selectable = true;
            summonButton.renderer.subImage = 0;

            actionButton.selectable = false;
            actionButton.renderer.subImage = 4;
        } else if(selected.level == 'summon') {
            let actionButton = this.buttonGroups[0].findByName('Actions');

            actionButton.selectable = true;
            actionButton.renderer.subImage = 0;
        } else {
            this.collapse(this.buttonGroups.find(bg => bg.name == "collapse").buttons[0]);
        }

        this.clearChildScenes();
    }

    onUpdateState(st) {

    }
}
/*
 * End File:
 * ./src/menus/SelectMenuMainScene.js
 */ 

/*
 * Start File:
 * ./src/menus/SelectMenuSubScene.js
 */ 
class SelectMenuSubScene extends SelectMenuMainScene {

    originBtn;
    src;
    selected;
    callBack;
    level;

    constructor(x,y,dx,dy,width,height, originBtn) {
        super(x,y,dx,dy,width,height,Scene.DisplayModes.absolute);
        this.originBtn = originBtn;
    }

    init(src, level) {
        this.src = src;
        this.level = level;
        this.addOptionButtons(src);
        this.addSelectButton();
        this.addCreateButton();
        this.addUpdateButton();
        this.addDeleteButton();
        super.addCloseButton();
    }

    refresh(src, level) {
        this.buttonGroups.forEach(btnGroup => {
            btnGroup.buttons.forEach(btn => {
                btn.destroy();
            });
        });

        this.buttonGroups = [];

        this.init(src, level);
    }

    addOptionButtons(src) {
        let btnGroup = new ButtonGroup();
        for(let i = 0; i < src.length; i++) {
            let obj = src[i];

            let btn = new Button(0,0,this.game.images.button);
            btn.setObj(obj);
            btn.transform.scale = new vector(.6,.6);
            btn.transform.position = new vector(btn.transform.size.x / 2 + (btn.transform.size.x * Math.floor(i / 5) + 1), 
                                                (btn.transform.size.y * 1.7) + (btn.transform.size.y * (i % 5)));

            btn.clicked = (btn) => {
                this.selected = btn.obj;
                btnGroup.manageSelect(btn);
            }

            btnGroup.addButton(btn);
            this.addObject(btn);
        }
        this.buttonGroups.push(btnGroup);
    }

    addSelectButton() {
        let btnGroup = new ButtonGroup();
        let btn = new Button(0,0, this.game.images.button);
        btn.setName("Select");

        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x / 2, this.height - btn.transform.size.y );

        btn.held = (btn) => {
            btnGroup.held(btn);

            if(!this.selected) {
                return;
            }

            this.callBack && this.callBack(this);
        };

        btnGroup.addButton(btn);
        this.addObject(btn);
        this.buttonGroups.push(btnGroup);
    }

    addCreateButton() {
        let btnGroup = new ButtonGroup();
        let btn = new Button(0,0,this.game.images.button);

        btn.setName("Create");
        btn.transform.scale = new vector(.5,.5);
        btn.transform.position = new vector(btn.transform.size.x * 2, this.height - btn.transform.size.y);

        btn.held = (btn) => {
            btnGroup.held(btn);
        }

        btn.clicked = (btn) => {
            let scene = new CreateScene(420, 350, null, null, 250 ,400, btn);

            scene.callBack = (scene, createdObj) => {
                this.src.push(createdObj);
                this.refresh(this.src, this.level);
                scene.destroy();
            };

            this.loadChildScene(scene);
            scene.init(this.src, this.level);
            btnGroup.manageSelect(btn);

        }

        btnGroup.addButton(btn);
        this.addObject(btn);
        this.buttonGroups.push(btnGroup);
    }

    addUpdateButton() {
        let btnGroup = new ButtonGroup();
        let btn = new Button(0,0,this.game.images.button);

        btn.setName("Update");
        btn.transform.scale = new vector(.5,.5);
        btn.transform.position = new vector(btn.transform.size.x * 3, this.height - btn.transform.size.y);

        btnGroup.addButton(btn);
        this.addObject(btn);
        this.buttonGroups.push(btnGroup);
    }

    addDeleteButton() {
        let btnGroup = new ButtonGroup();
        let btn = new Button(0,0,this.game.images.button);

        btn.setName("Delete");
        btn.transform.scale = new vector(.5,.5);
        btn.transform.position = new vector(btn.transform.size.x * 4, this.height - btn.transform.size.y);

        btnGroup.addButton(btn);
        this.addObject(btn);
        this.buttonGroups.push(btnGroup);
    }

    onUpdateSelected(selected) {
    }

}
/*
 * End File:
 * ./src/menus/SelectMenuSubScene.js
 */ 

/*
 * Start File:
 * ./src/menus/XEditMenuMainScene.js
 */ 
class EditMenuMainScene extends SelectMenuMainScene {

    originWidth;
    targetWidth;
    parentWidth;
    hidden = true;
    
    constructor(x,y,dx,dy,width,height, parentWidth, parentHeight) {
        super(parentWidth,y,dx,dy,0,height,Scene.DisplayModes.absolute);
        this.originPosition = new vector(x,y);
        this.originWidth = width;
        this.targetWidth = 35;

        this.parentWidth = parentWidth;
    }

    init(selected) {

        this.addCollapseButton();
        this.addEditButton();

        this.show();
    }

    hide() {
        if(this.hidden == true) return;
        this.hidden = true;
        let tween = new TWEEN.Tween(this.position)
            .to({ x: this.parentWidth, y: this.originPosition.y }, 800)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { this.activeTween = null; this.onDone && this.onDone.call(this); });

        let sizeTween = new TWEEN.Tween(this.size)
            .to({ x: 0}, 800)
            .easing(TWEEN.Easing.Bounce.Out);
    
        tween.onStart(() => {this.stopActiveTween(tween); sizeTween.start()});
        tween.start();

        this.buttonGroups.forEach((bg) => { bg.buttons.forEach(btn => btn.selectable=false)});
    }

    show() {
        if(!this.hidden) return;
        this.hidden = false;
        let tween = new TWEEN.Tween(this.position)
            .to({ x: this.originPosition.x, y: this.originPosition.y }, 800)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { this.activeTween = null; this.onDone && this.onDone.call(this); });

        let sizeTween = new TWEEN.Tween(this.size)
            .to({ x: this.originWidth}, 800)
            .easing(TWEEN.Easing.Bounce.Out);
    
        tween.onStart(() => {this.stopActiveTween(tween); sizeTween.start()});
        tween.start();

        this.buttonGroups.forEach((bg) => { bg.buttons.forEach(btn => btn.selectable=true)});
        this.buttonGroups.find(bg => bg.name == "collapse").buttons[0].renderer.sprite=this.game.images.buttonRight;
        this.collapsed=false;
    }

    addEditButton() {
        let editRangeButton = new Button(100,80, this.game.images.button);
        let editTargetButton = new Button(100, 140, this.game.images.button);

        editRangeButton.transform.scale = new vector(0.6,.7);
        editRangeButton.setName("Edit Range");
        editRangeButton.textSize = 14;

        editTargetButton.transform.scale = new vector(0.6,.7);
        editTargetButton.setName("Edit Targets");
        editTargetButton.textSize = 14;

        this.addObject(editRangeButton);
        this.addObject(editTargetButton);

        editRangeButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        editRangeButton.clicked = (btns) => {
            this.collapse(this.buttonGroups.find(bg=>bg.name=="collapse").buttons[0]);
            currentState.set('EDIT_RANGE');
        }

        let buttonGroup = new ButtonGroup();

        buttonGroup.addButton(editRangeButton);
        buttonGroup.addButton(editTargetButton);

        this.buttonGroups.push(buttonGroup);
    }

    addCollapseButton() {
        let buttonGroup = new ButtonGroup();
        buttonGroup.name="collapse";

        let collapseButton = new Button(0,0, this.game.images.buttonRight);
        collapseButton.transform.scale = new vector(.6,.6);
        collapseButton.transform.position = new vector(collapseButton.transform.size.x/2, collapseButton.transform.size.y/2);

        collapseButton.held = (btn) => {
            buttonGroup.held(btn);
        };

        collapseButton.clicked = (btn) => {

            this.collapse(btn);
        }

        this.addObject(collapseButton);
        buttonGroup.addButton(collapseButton);
        this.buttonGroups.push(buttonGroup);
    }

    createTween (target, time, onDone, context)
    {
        let tween = new TWEEN.Tween(context.position)
            .to({ x: target.x, y: target.y }, time)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { context.activeTween = null; onDone && onDone.call(context); });

        let sizeTween = new TWEEN.Tween(context.size)
            .to({ x: this.determineWidth()}, time)
            .easing(TWEEN.Easing.Bounce.Out);

        return tween.onStart(() => {context.stopActiveTween(tween); sizeTween.start()});
    }

    determineWidth() {
        if(this.collapsed) {
            return this.originWidth;
        }
        return this.targetWidth;
    }

    handleMouse() {
        if(this.hidden) return;
        super.handleMouse();
    }

    onUpdateSelected(selected) {

    }
}
/*
 * End File:
 * ./src/menus/XEditMenuMainScene.js
 */ 

/*
 * Start File:
 * ./src/menus/ZAddTileScene.js
 */ 
class AddTileScene extends SelectMenuMainScene {

    originBtn;
    callBack;
    closeCallBack;
    newObj = {};
    input;
    focus;

    inputFields = []; // contains {property, func}
    addedFields = [];

    constructor(x,y,dx,dy,width,height) {
        super(x,y,dx,dy,width,height,Scene.DisplayModes.absolute);
    }

    init(hexData) {
        this.input = hexData;
        this.addCloseButton();
        this.addSaveButton();
        this.createRadioButton(100, 50, 20,[{value:"off"},{value:"on"}], "enabled", hexData.oldPath);
        this.createInputField(100,200, "dice", hexData.dice);
    }

    createInputField(x,y, property, oldValue) {
        let inputFieldObjectFieldMap = {};
        let clickableField = new GameObject(x,y, this.game.images.input);
        clickableField.transform.scale = new vector(.1,.1);
        this.addObject(clickableField);

        let inputField = document.createElement("input");
        inputField.setAttribute("type","text");
        inputField.value = oldValue ? oldValue : "";
        document.body.appendChild(inputField);

        clickableField.draw = () => {
            GameObject.prototype.draw.call(clickableField);

            let ctx = this.cv_context;
            ctx.font = "10px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText(property + " : ", x-clickableField.transform.size.x /2, y + 5);

            ctx.textAlign = "left";
            ctx.fillText(inputField.value, x-clickableField.transform.size.x /2 + 5, y + 5);
        }

        clickableField.onClick = () => {
            inputField.focus();
            this.focus = inputField;
        }

        inputFieldObjectFieldMap.prop = property;
        inputFieldObjectFieldMap.input = () => inputField.value;
        this.inputFields.push(inputFieldObjectFieldMap);
        this.addedFields.push(inputField);
    }

    createRadioButton(x,y,spacing,opts,targetProperty, oldPath) {
        let buttonGroup = new RadioButtonGroup();
        let htmlFields = [];

        for(let i = 0; i < opts.length; i++) {
            let radioButton = new GameObject(x, y + (spacing * i), this.game.images.radioOff);
            radioButton.id = i;
            radioButton.name = opts[i].value
            radioButton.transform.scale = new vector(.03,.03);
            this.addObject(radioButton);
            
            let htmlButton = document.createElement("input");

            htmlButton.setAttribute("type","radio");
            htmlButton.setAttribute("name",targetProperty);
            htmlButton.setAttribute("value", opts[i].value);
            htmlButton.id = ""+ targetProperty + i
            htmlFields.push(htmlButton);
            this.addedFields.push(htmlButton);
            document.body.appendChild(htmlButton);

            radioButton.draw = () => {
                GameObject.prototype.draw.call(radioButton);
                let ctx = this.cv_context;
                ctx.font = "10px Verdana";
                ctx.fillStyle = "black";

                if(radioButton.id == 0) {
                    ctx.textAlign = "right";
                    ctx.fillText(targetProperty + " : ", x - radioButton.transform.size.x /2, y + 5);
                }
                
                ctx.textAlign = "left";
                ctx.fillText(opts[i].value, x - radioButton.transform.size.x + 30, y + spacing*i + 5);

            }
            
            radioButton.onClick = () => {
                buttonGroup.manageSelect(radioButton);
                htmlFields.forEach(e => e.checked = false);
                htmlButton.checked = true;
            }
            buttonGroup.addButton(radioButton);
        }

        if(oldPath) {
            buttonGroup.findByName("on").onClick();
        } else {
            buttonGroup.findByName("off").onClick();
        }

        let obj = {};
        obj.prop = targetProperty;
        obj.input = () => htmlFields.find((e) => e.checked).value;

        this.inputFields.push(obj);
    }

    addSaveButton() {
        let buttonGroup = new ButtonGroup();

        let btn = new Button(0,0, this.game.images.button);
        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x/2, this.height - btn.transform.size.y/2);
        btn.name = "Save";
        btn.clicked = (btn) => {
            
            this.inputFields.forEach(map => {
                this.newObj[map.prop] = map.input();
            });
            this.addedFields.forEach(e => e.remove());

            this.input.mod = this.newObj;

            this.callBack && this.callBack(this.input);
            this.close();
        };

        this.addObject(btn);

        buttonGroup.addButton(btn);

        this.buttonGroups.push(buttonGroup);
    }

    close() {
        this.closeCallBack && this.closeCallBack(this.input);
        this.destroy();
    }

    onUpdateSelected() {
        this.destroy();
    }

    onUpdateState() {
        this.destroy();
    }
}
/*
 * End File:
 * ./src/menus/ZAddTileScene.js
 */ 

/*
 * Start File:
 * ./src/menus/ZCreateScene.js
 */ 
class CreateScene extends SelectMenuMainScene {

    originBtn;
    callBack;
    focus;
    newObj;
    level;

    inputFields = []; // contains {property, input}

    constructor(x,y,dx,dy,width,height, button) {
        super(x,y,dx,dy,width,height,Scene.DisplayModes.absolute);
        this.originBtn = button;
    }

    init(objRoot, level) {
        super.addCloseButton();

        this.level = level;
        this.newObj = {};
        this.newObj.id = nextId(objRoot);

        if(level == "summoner") {
            this.newObj.summons = [];
            this.addCreateButton();
            this.createInputField(120,80,'name');
        } else if(level == "summon") {
            this.newObj.actions = [];
            this.newObj.actions = [];
            this.addCreateButton();
            this.createInputField(120, 80, 'name');
            // create base summon + construct input fields for summon
        } else {
            //create base action. immediately select + right side window
        }
    }

    createInputField(x,y, property) {
        let inputFieldObjectFieldMap = {};
        let clickableField = new GameObject(x,y, this.game.images.input);
        clickableField.transform.scale = new vector(.1,.1);
        this.addObject(clickableField);

        let inputField = document.createElement("input");
        inputField.setAttribute("type","text");
        document.body.appendChild(inputField);

        clickableField.draw = () => {
            GameObject.prototype.draw.call(clickableField);

            let ctx = this.cv_context;
            ctx.font = "10px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText(property + " : ", x-clickableField.transform.size.x /2, y + 5);

            ctx.textAlign = "left";
            ctx.fillText(inputField.value, x-clickableField.transform.size.x /2 + 5, y + 5);
        }

        clickableField.onClick = () => {
            inputField.focus();
            this.focus = inputField;
        }

        inputFieldObjectFieldMap.input = inputField;
        inputFieldObjectFieldMap.prop = property;
        this.inputFields.push(inputFieldObjectFieldMap);
    }

    addCreateButton() {
        let buttonGroup = new ButtonGroup();

        let btn = new Button(0,0, this.game.images.button);
        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x/2, this.height - btn.transform.size.y/2);
        btn.name = "Create";
        btn.held = (btn) => {
            buttonGroup.held(btn);

            this.originBtn.selected = false;
            this.originBtn.renderer.subImage = 0;
            
            this.inputFields.forEach(map => {
                this.newObj[map.prop] = map.input.value;
                map.input.remove();
            })

            this.callBack && this.callBack(this, this.newObj);
        };

        this.addObject(btn);

        buttonGroup.addButton(btn);

        this.buttonGroups.push(buttonGroup);
    }

    draw() {
        super.draw();
        if(!this.newObj) {
            return;
        }
        let ctx = this.cv_context;
        ctx.font = "10px Verdana";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.fillText("ID: " + this.newObj.id ,40, 40);

        ctx.fillText("Create a " + this.level, 20,20);
    }

    onUpdateSelected(selected) {
        this.destroy();
    }
}
/*
 * End File:
 * ./src/menus/ZCreateScene.js
 */ 

/*
 * Start File:
 * ./src/objects/button.js
 */ 
class Button extends GameObject {

    hovered; // bool
    selected; //bool
    isClicked; // bool
    clicked; //func
    held; //func
    selectable = true; //bool
    obj;
    name;
    textSize = 10;

    constructor(x,y, image) {
        super(x,y,image,1);
    }

    setObj(obj) {
        this.obj = obj;
        this.name = obj.name;
    }

    setName(name) {
        this.name = name;
    }

    update (deltaTime) {
        super.update(deltaTime);

        if(!GameInput.g_mouseDown) {
            this.isClicked = false;
        }
    }

    draw() {
        super.draw();

        if(this.name) {
            let ctx = this.scene.cv_context;
            ctx.font = this.textSize + "px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.name,this.transform.position.x, this.transform.position.y);
        }
    }

    onClick(btns) {
        this.isClicked = true;
        if(this.selected || !this.selectable) {
            return;
        }
        if(btns.left) {
            this.clicked && this.clicked(this);
        }
    }

    onMouseHeld(btns) {
        if(this.isClicked) {
            if(this.selected || !this.selectable) {
                return;
            }
            if(btns.left) {
                this.held && this.held(this);
            }
        }
    }
}
/*
 * End File:
 * ./src/objects/button.js
 */ 

/*
 * Start File:
 * ./src/objects/buttonGroup.js
 */ 
class ButtonGroup {

    buttons = [];
    selectedInGroup;
    name;

    findByName(buttonName) {
        return this.buttons.find(button => button.name == buttonName);
    }

    addButton(button) {
        this.buttons.push(button);
        if(!button.selectable) {
            button.renderer.subImage = 4;
        }
    }

    hover(mousePos) {
        this.buttons.forEach(button => {
            if(button.selected) {
                return;
            }

            if(!button.selectable) {
                button.renderer.subImage = 4;
                return;
            }

            if(this.isWithin(mousePos, button)) {
                button.renderer.subImage = 1;
            } else {
                button.renderer.subImage = 0;
                
            }
        });
    }

    held(btn) {
        if(btn.isClicked) {
            btn.renderer.subImage = 2;
        }
    }

    isWithin(mousePos, button) {
        return mousePos.x > button.transform.position.x - button.transform.size.x / 2 && 
            mousePos.x < button.transform.position.x + button.transform.size.x / 2 &&
            mousePos.y > button.transform.position.y - button.transform.size.y / 2&&
            mousePos.y < button.transform.position.y + button.transform.size.y / 2;
    }

    manageSelect(btn) {
        this.buttons.forEach(button => {
            if(button === btn && button.selectable) {
                button.renderer.subImage = 3;
                button.selected = true;
                this.selectedInGroup = button;
            } else {
                if(button.selectable) {
                    button.renderer.subImage = 0;
                    button.selected = false;
                }
            }
        });
    }
}
/*
 * End File:
 * ./src/objects/buttonGroup.js
 */ 

/*
 * Start File:
 * ./src/objects/cube.js
 */ 
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
/*
 * End File:
 * ./src/objects/cube.js
 */ 

/*
 * Start File:
 * ./src/objects/hex.js
 */ 
class Hex extends GameObject {

    borderAbs;
    radius;
    cube;

    constructor(x,y, image) {
        super(x,y,image,0);
        this.transform.scale = new vector(0.08,0.08);
    }

}
/*
 * End File:
 * ./src/objects/hex.js
 */ 

/*
 * Start File:
 * ./src/objects/hexChar.js
 */ 
class HexChar extends Hex {
    
    direction;
    updateField;

    constructor(x,y, image, update) {
        super(x,y,image);
        this.direction = CubeDirection.N;
        this.updateField = update;
    }

    update (deltaTime) {
        super.update(deltaTime);
        if(state.state == 'VIEW') {
            if(GameInput.isPressed(GameInput.keys["e"])) {
                this.direction = direction_right(this.direction);
                
                this.transform.rotation = (this.transform.rotation + 60) % 360;

                this.updateField();

            } else if(GameInput.isPressed(GameInput.keys["q"])) {
                this.direction = direction_left(this.direction);
                this.transform.rotation = (this.transform.rotation - 60) % 360;

                this.updateField();

            } else if(GameInput.isPressed(GameInput.keys["s"])) {
                this.direction = direction_opposite(this.direction);
                this.transform.rotation = (this.transform.rotation + 180) % 360;

                this.updateField();
            }
        }
    }

}

const range_of_vision = {
    "STRAIGHT":["N"],
    "CONE":["N","NE","NW"],
    "WIDE":["N","NE", "SE", "NW","SW"],
    "ALL":["N","NE", "SE", "NW","SW", "S"],

}
/*
 * End File:
 * ./src/objects/hexChar.js
 */ 

/*
 * Start File:
 * ./src/objects/radioButtonGroup.js
 */ 
class RadioButtonGroup extends ButtonGroup {

    constructor() {
        super()
    }

    findByName(buttonName) {
        return this.buttons.find(button => button.name == buttonName);
    }

    addButton(button) {
        this.buttons.push(button);
    }

    hover(mousePos) {
        this.buttons.forEach(button => {
            if(button.selected) {
                return;
            }
        });
    }

    held(btn) {
    }

    isWithin(mousePos, button) {
        return mousePos.x > button.transform.position.x - button.transform.size.x / 2 && 
            mousePos.x < button.transform.position.x + button.transform.size.x / 2 &&
            mousePos.y > button.transform.position.y - button.transform.size.y / 2&&
            mousePos.y < button.transform.position.y + button.transform.size.y / 2;
    }

    manageSelect(btn) {
        this.buttons.forEach(button => {
            if(button === btn) {
                button.renderer.sprite = game.images.radioOn;
                this.selectedInGroup = button;
            } else {
                button.renderer.sprite = game.images.radioOff;
            }
        });
    }
}
/*
 * End File:
 * ./src/objects/radioButtonGroup.js
 */ 

/*
 * Start File:
 * ./src/StateManager.js
 */ 
class StateManager {

    selected = {level: null, object: null}; // {level, object}
    lastSelectedObj = {level: null, object: null};
    state = "VIEW"; //EDIT_RANGE,EDIT_TARGETS,VIEW

    //for all scenes and childScenes: updateState(selected);

    updateSelected(level, object) {
        this.selected.level = level;
        this.selected.object = object;
        this.lastSelectedObj.level = level;
        this.lastSelectedObj.object = object;
        game.activeScenes.forEach(actS => {
            actS.onUpdateSelected(this.selected);
        });

        if(level == 'summoner') {
            updateQueryParams("summoner="+object.id);
        } else if(level == 'summon') {
            updateQueryParams("summoner="+currentSummoner.get().id + "&summon="+object.id);
        } else {
            updateQueryParams("summoner="+currentSummoner.get().id + "&summon="+currentSummon.get().id + "&action="+object.id);
        }
    }

    updateState(state) {
        this.state = state;
        game.activeScenes.forEach(actS => {
            actS.onUpdateState(this.state);
        });
    }


}
/*
 * End File:
 * ./src/StateManager.js
 */ 

/*
 * Start File:
 * ./src/ZPathFinder.js
 */ 
class PathFinder {

    static find = function(cubeStart, cubeDestination, map) {

        if(cubeStart == cubeDestination) return;
    
        let open = [];
        let closed = [];
    
        open.push({c: cubeStart,parent: null, f: cube_distance(cubeStart, cubeDestination) * 2});
        let next;
    
        while(open.length > 0) {
            next = open.reduce((c1,c2) => {if(c1.f > c2.f) { return c2} return c1});
            open.remove(next);
    
            let surroundingCubes = cube_neighbors(next.c);
            let destCheck = surroundingCubes.find(c => cube_matches(c, cubeDestination))
            if(destCheck) {
                next = {
                    c:destCheck, 
                    parent:next,
                    f:0, 
                    dir:cube_direction(next.c, destCheck)
                };
                break;
            }
    
            surroundingCubes.forEach(cube => {
                if(!closed.find(c => cube_matches(c.c, cube))) {
                    let presentInOpen = open.find(c => cube_matches(c.c, cube))
    
                    if(presentInOpen) {
                        if(presentInOpen.f > cube_distance(cube, cubeDestination) * 2 + pos_distance(getByKey(map,cube).transform.position, getByKey(map,cubeDestination).transform.position)) {
                            presentInOpen.f = cube_distance(cube, cubeDestination) * 2 + pos_distance(cube, cubeDestination);
                            presentInOpen.parent = next;
                            presentInOpen.dir = cube_direction(next.c, cube);
                        }
                    } else {
                        open.push({
                            c: cube, 
                            parent:next, 
                            f: cube_distance(cube, cubeDestination) * 2 + pos_distance(getByKey(map, cube).transform.position, getByKey(map, cubeDestination).transform.position), 
                            dir:cube_direction(next.c, cube)
                        });
                    }
                }
            });
    
            closed.push(next);
        }

        let path = [];
    
        while(next.parent) {
    
            if(next.parent) {
                path.push(next.dir);
                next = next.parent;
            }
        }
        return path;
    }
}
/*
 * End File:
 * ./src/ZPathFinder.js
 */ 
