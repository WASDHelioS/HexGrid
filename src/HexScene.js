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