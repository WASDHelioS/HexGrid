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

        this.hexSceneManager.drawText(this.cv_context);
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