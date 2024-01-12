
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
var items;
var currentItem;

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
        ]
        , function ()
        {
            this.preloadJsonThenStart("./patterns.json", function() {
                this.prepopulateHtml();
                this.createMainScene(game);
            })
        });
};

createMainScene = function (game)
{
    var scene = new HexScene(10, 10, 900, 800, Scene.DisplayModes.absolute);

    this.game.loadScene(scene);

    scene.init();

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

function prepopulateHtml() {
    this.populateSummonData();
}

function populateSummonData(selectedId) {
    let selectSummon = document.getElementById("selectSummon");
    selectSummon.innerHTML = "";

    for(let item of items.items) {
        let option = document.createElement('option');
        option.value = item.id;
        option.text = item.name;
        selectSummon.add(option);
    }
    if(selectedId) {
        selectSummon.value=selectedId.toString();
    }
}

function onSelectSummon() {
    let id = document.getElementById("selectSummon").value;
    currentItem = items.items.find(item => item.id == id);

    document.getElementById("summonDetailDiv").hidden = false;

    document.getElementById("summonName").value = currentItem.name;

    document.getElementById("actionSelectDiv").hidden = false;
    selectAction = document.getElementById("selectAction");
    selectAction.innerHTML = "";

    for(let action of currentItem.action) {
        let option = document.createElement('option');
        option.value = action.id;
        option.text = action.name;
        selectAction.add(option);
    }
}

function onCreateSummon() {
    let newItem = {};
    newItem.id = nextId();
    newItem.name = "";
    newItem.action = [];

    items.items.push(newItem);

    document.getElementById("selectSummon").value = newItem.id;

    currentItem = newItem;

    populateSummonData(newItem.id);
    onSelectSummon();
}

function onUpdateSummon() {
    currentItem.name = document.getElementById("summonName").value;
    populateSummonData(currentItem.id);
    onSelectSummon();
}

function onDeleteSummon() {

}

function onSelectAction() {

}

async function preloadJsonThenStart (location, onComplete)
{
    const cont = async () =>
    {
        await $.getJSON(location, function(obj) {
            items = obj;
            });
        onComplete && onComplete();
    };

    cont.apply();
}

function nextId() {
    let highest = 0;
    for(let item of items.items) {
        if(item.id > highest) {
            highest = item.id;
        }
    }

    return highest + 1;
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

    testCharacter;

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

    selectedAction;

    constructor(scene) {
        this.scene = scene;
        this.testCharacter = items.items[0];
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
        this.addValidHexes();
        this.colorValidHexes();
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
        let maxDistance = this.testCharacter.action[0].distanceMax;
        let minDistance = this.testCharacter.action[0].distanceMin;
        if(!minDistance) {
            minDistance = 0;
        }
        if(!maxDistance) {
            maxDistance = 10;
        }

        let directions = range_of_vision[this.testCharacter.action[0].rangeOfVision];

        let diagonal = this.testCharacter.action[0].diagonalVision;

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
        let pattern = this.testCharacter.action[0].pattern;
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

/*
 * End File:
 * ./src/HexSceneManager.js
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
