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
        summonButton.selectable = false;
        summonButton.setName("Summons");
        summonButton.textSize = 14;

        actionButton.transform.scale = new vector(0.8, 1);
        actionButton.selectable = false;
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
            clearChildScenes(this);
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

            currentSummoner = scene.selected;
            currentSummon = null;
            currentAction = null;

            scene.originBtn.selected = false;
            scene.originBtn.renderer.subImage = 0;
            scene.destroy();

            summonButton.selectable = true;
            summonButton.renderer.subImage = 0;

            };

            this.loadChildScene(scene);
            scene.init(summoners);
            buttonGroup.manageSelect(btn);
        };

        summonerButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        summonButton.clicked = (btn) => { 
            clearChildScenes(this); 
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentSummon = scene.selected;
                currentAction = null;

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                scene.destroy();

                actionButton.selectable = true;
                actionButton.renderer.subImage = 0;

            };

            this.loadChildScene(scene);
            scene.init(currentSummoner.summons);
            buttonGroup.manageSelect(btn);
        };

        summonButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        actionButton.clicked = (btn) => { 
            clearChildScenes(this); 
            let scene = new SelectMenuSubScene(225, 100, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentAction = scene.selected;

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                this.parentScene.load();
                scene.destroy();
            };

            this.loadChildScene(scene);
            scene.init(currentSummon.actions);
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