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

    menuScene = new SelectMenuMainScene(0, 100,-170,100, 200, 600);

    scene.loadChildScene(selectedScene);
    scene.loadChildScene(menuScene);
    menuScene.init();

    console.log("Game started!");
};

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value && value === searchValue)
            return key;
    }
}

function getKeyByNestedValue(map, searchValue, prop) {
    for(let [key,value] of map.entries()) {
        if(value[prop] && value[prop] === searchValue) {
            return key;
        }
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
                currentSummoner = summoners.find(summ => summ.id == strArr[1]);
                return;
            case "summon":
                currentSummon = currentSummoner.summons.find(summ => summ.id == strArr[1]);
                return;
            case "action":
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

function updateQueryParams(str) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' +str;
    window.history.replaceState({path: newurl}, "", newurl);
}