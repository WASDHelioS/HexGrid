var game = new Game();
var items;

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