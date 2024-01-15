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

function prepopulateHtml() {
    this.populateSummonerData();
}

function populateSummonerData(selectedId) {
    let selectSummoner = document.getElementById("selectSummoner");
    selectSummoner.innerHTML = "";

    for(let summoner of summoners) {
        let option = document.createElement('option');
        option.value = summoner.id;
        option.text = summoner.name;
        selectSummoner.add(option);
    }
    if(selectedId) {
        selectSummoner.value=selectedId.toString();
    }
}

function onSelectSummoner() {
    currentSummon = null;
    currentAction = null;
    document.getElementById("summonDetailDiv").hidden = true;
    document.getElementById("actionSelectDiv").hidden = true;
    document.getElementById("actionDetailDiv").hidden = true;
    scene.load();

    let id = document.getElementById("selectSummoner").value;
    currentSummoner = summoners.find(summoner => summoner.id == id);

    document.getElementById("summonerDetailDiv").hidden = false;

    document.getElementById("summonerName").value = currentSummoner.name;

    document.getElementById("summonSelectDiv").hidden = false;
    
    populateSummonData();
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

function populateSummonData(selectedId) {
    let selectSummon = document.getElementById("selectSummon");
    selectSummon.innerHTML = "";

    for(let summon of currentSummoner.summons) {
        let option = document.createElement('option');
        option.value = summon.id;
        option.text = summon.name;
        selectSummon.add(option);
    }
    if(selectedId) {
        selectSummon.value=selectedId.toString();
    }
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

function onSelectAction() {
    let id = document.getElementById("selectAction").value;
    currentAction = currentSummon.actions.find(action => action.id == id);

    document.getElementById("actionDetailDiv").hidden = false;

    document.getElementById("actionName").value = currentAction.name;
    document.getElementById("distanceMin").value = currentAction.distanceMin ? currentAction.distanceMin : null;
    document.getElementById("distanceMax").value = currentAction.distanceMax ? currentAction.distanceMax : null;
    document.getElementById("rangeOfVision").value = currentAction.rangeOfVision;
    document.getElementById("diagonalVision").value = currentAction.diagonalVision;

    scene.load();
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

function clearChildScenes(parentScene) {
    game.activeScenes.forEach(scene => {
        if(scene.parentScene === parentScene) {
            scene.destroy();
        }
    })
}