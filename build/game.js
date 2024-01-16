
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
var summoners;
var currentSummoner;
var currentSummon;
var currentAction;

var scene;

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

            { name: "button", url: "images/buttons.png", subImgTotal: 5, perRow: 1},
            { name: "buttonX", url: "images/buttonsX.png", subImgTotal: 3, perRow: 1},
            { name: "buttonLeft", url: "images/buttonsLeft.png", subImgTotal: 3, perRow: 1},
            { name: "buttonRight", url: "images/buttonsRight.png", subImgTotal: 3, perRow: 1},

            { name: "input", url: "images/input.png"},
        ]
        , function ()
        {
            this.preloadJsonThenStart("./patterns.json", function() {

                readAndApplyQueryParams();

                this.createMainScene(game);
            })
        });
};

createMainScene = function (game)
{
    scene = new HexScene(10, 10, 900, 800, Scene.DisplayModes.absolute);

    this.game.loadScene(scene);

    scene.init();

    selectedScene = new SelectedScene(10,10, 900, 50);

    menuScene = new SelectMenuMainScene(0, 100, 200, 600);

    scene.loadChildScene(selectedScene);
    scene.loadChildScene(menuScene);
    menuScene.init();

    console.log("Game started!");
};

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

function getByKey(map, searchValue) {
    for(let [key, value] of map.entries()) {
        if(cube_matches(key,searchValue)) {
            return value;
        }
    }
}


function onCreateSummoner() {
    let newSummoner = {};
    newSummoner.id = nextId(summoners);
    newSummoner.name = "";
    newSummoner.summons = [];

    summoners.push(newSummoner);

    document.getElementById("selectSummoner").value = newSummoner.id;

    currentSummoner = newSummoner;

    populateSummonerData(newSummoner.id);
    onSelectSummoner();
}

function onUpdateSummoner() {
    currentSummoner.name = document.getElementById("summonerName").value;
    populateSummonerData(currentSummoner.id);
    onSelectSummoner();
}

function onDeleteSummoner() {

}

function onSelectSummon() {    
    currentAction = null;
    document.getElementById("actionSelectDiv").hidden = true;
    document.getElementById("actionDetailDiv").hidden = true;
    scene.load();

    let id = document.getElementById("selectSummon").value;
    currentSummon = currentSummoner.summons.find(item => item.id == id);

    document.getElementById("summonDetailDiv").hidden = false;

    document.getElementById("summonName").value = currentSummon.name;

    document.getElementById("actionSelectDiv").hidden = false;
    selectAction = document.getElementById("selectAction");
    selectAction.innerHTML = "";

    for(let action of currentSummon.actions) {
        let option = document.createElement('option');
        option.value = action.id;
        option.text = action.name;
        selectAction.add(option);
    }
}

function onCreateSummon() {
    scene.load();
    let newSummon = {};
    newSummon.id = nextId(currentSummoner.summons);
    newSummon.name = "";
    newSummon.actions = [];

    currentSummoner.summons.push(newSummon);

    document.getElementById("selectSummon").value = newSummon.id;

    currentSumon = newSummon;

    populateSummonData(newSummon.id);
    onSelectSummon();
}

function onUpdateSummon() {
    currentSummon.name = document.getElementById("summonName").value;
    populateSummonData(currentSummon.id);
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
    newTab.document.write("<html><body><pre>" +  JSON.stringify(summoners, null, 4) + "</pre></body></html>");
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
                console.log("setting summoner")
                currentSummoner = summoners.find(summ => summ.id == strArr[1]);
                return;
            case "summon":
                console.log("setting summon")
                currentSummon = currentSummoner.summons.find(summ => summ.id == strArr[1]);
                return;
            case "action":
                console.log("setting action")
                currentAction = currentSummon.actions.find(act => act.id == strArr[1]);
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

    init() {
        this.hexSceneManager.init();
    }

    load() {
        this.hexSceneManager.loadForOrientation();
    }

    update (deltaTime)
    {
        super.update(deltaTime);
        this.detectMouse();
    }

    draw ()
    {
        super.draw();
    }

    detectMouse() {
        if(!GameInput.mousePosition) {
            return;
        }

        let mousePos = new vector(GameInput.mousePosition.x, GameInput.mousePosition.y);
        mousePos.x -= this.x;
        mousePos.y -= this.y;

        this.hexSceneManager.updateIfHovered(mousePos);
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
        if(!currentAction) {
            this.replaceCenterHexBy(new Hex(this.scene.width/2,this.scene.height/2,this.hexagonWhite));
        }

        this.hoveredHex = null;
        this.hexMapValidTargets.clear();
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
        if(!cube_matches(getByValue(this.hexMapValidTargets, this.hoveredHex), new Cube(0,0,0))) {
            this.hoveredHex.renderer.sprite = this.hexagonWhite;
        }

        this.loadForOrientation();
    }
}

/*
 * End File:
 * ./src/HexSceneManager.js
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

cube_direction = function(c1, c2) {
    let vec = cube_add(c1, c2);
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
 * ./src/SelectedScene.js
 */ 
class SelectedScene extends Scene {

    constructor(x,y,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();

        if(currentSummoner) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText("Summoner : " + currentSummoner.name, 0, this.height / 2);
        }

        if(currentSummon) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Summon : " + currentSummon.name, this.width / 2, this.height / 2);
        }

        if(currentAction) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText("Action : " + currentAction.name, this.width, this.height / 2);
        }
    }
}
/*
 * End File:
 * ./src/SelectedScene.js
 */ 

/*
 * Start File:
 * ./src/SelectMenuMainScene.js
 */ 
class SelectMenuMainScene extends Scene {

    x;
    y;
    width;
    height;

    buttonGroups = [];

    constructor(x,y,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    init() {

        this.addHierarchyButtons();
        this.addImportButton();
        this.addExportButton();
        this.addResetButton();
    }

    addHierarchyButtons() {
        let summonerButton = new Button(80,100, this.game.images.button);
        let summonButton = new Button(80, 150, this.game.images.button);
        let actionButton = new Button(80, 200, this.game.images.button);

        summonerButton.transform.scale = new vector(0.8,1);
        summonerButton.setName("Summoners");
        summonerButton.textSize = 14;
        
        summonButton.transform.scale = new vector(0.8, 1);
        if(!currentSummoner) {
            summonButton.selectable = false;
        }
        summonButton.setName("Summons");
        summonButton.textSize = 14;

        actionButton.transform.scale = new vector(0.8, 1);
        if(!currentSummon) {
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
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentSummoner = scene.selected;
                currentSummon = null;
                currentAction = null;

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                this.parentScene.load();
                scene.destroy();

                summonButton.selectable = true;
                summonButton.renderer.subImage = 0;

                actionButton.selectable = false;
                actionButton.renderer.subImage = 4;

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
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentSummon = scene.selected;
                currentAction = null;

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                this.parentScene.load();
                scene.destroy();

                actionButton.selectable = true;
                actionButton.renderer.subImage = 0;

            };

            this.loadChildScene(scene);
            scene.init(currentSummoner.summons, "summon");
            buttonGroup.manageSelect(btn);
        };

        summonButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        actionButton.clicked = (btn) => { 
            this.clearChildScenes(); 
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentAction = scene.selected;

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                this.parentScene.load();
                scene.destroy();
            };

            this.loadChildScene(scene);
            scene.init(currentSummon.actions, "action");
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

        let translatedMousePos = new vector(GameInput.mousePosition.x - this.x, GameInput.mousePosition.y-this.y);

        if(translatedMousePos.x < 0 || translatedMousePos.y < 0 || translatedMousePos.x > this.width || translatedMousePos.y > this.height) {
            return;
        }

        if(GameInput.mouseHeld().left) {
            return;
        }

        this.buttonGroups.forEach(bg => bg.hover(translatedMousePos));
    }
}
/*
 * End File:
 * ./src/SelectMenuMainScene.js
 */ 

/*
 * Start File:
 * ./src/SelectMenuSubScene.js
 */ 
class SelectMenuSubScene extends SelectMenuMainScene {

    originBtn;
    src;
    selected;
    callBack;
    level;

    constructor(x,y,width,height, originBtn) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
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
        this.addCloseButton();
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
            let scene = new CreateScene(420, 350, 250 ,400, btn);

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

    addCloseButton() {
        let buttonGroup = new ButtonGroup();

        let xButton = new Button(0,0, this.game.images.buttonX);
        xButton.transform.scale = new vector(.6,.6);
        xButton.transform.position = new vector(this.width - xButton.transform.size.x/2, xButton.transform.size.y/2);
        xButton.held = (btn) => {
            buttonGroup.held(btn);

            this.originBtn.selected = false;
            this.originBtn.renderer.subImage = 0;
            this.destroy();
        };

        this.addObject(xButton);

        buttonGroup.addButton(xButton);

        this.buttonGroups.push(buttonGroup);
    }

}
/*
 * End File:
 * ./src/SelectMenuSubScene.js
 */ 

/*
 * Start File:
 * ./src/ZCreateScene.js
 */ 
class CreateScene extends SelectMenuMainScene {

    originBtn;
    callBack;
    focus;
    newObj;
    level;

    inputFields = []; // contains {property, input}

    constructor(x,y,width,height, button) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.originBtn = button;
    }

    init(objRoot, level) {
        this.level = level;
        this.newObj = {};
        this.newObj.id = nextId(objRoot);

        if(level == "summoner") {
            this.newObj.summons = [];
            this.createButton();
            this.createInputField(120,80,'name');
        } else if(level == "summon") {
            this.newObj.actions = [];
            this.newObj.actions = [];
            this.createButton();
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

    createButton() {
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
}
/*
 * End File:
 * ./src/ZCreateScene.js
 */ 
