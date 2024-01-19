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