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