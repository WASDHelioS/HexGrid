class SelectMenuMainScene extends Scene {

    targetPosition;
    originPosition;
    activeTween;

    x;
    y;
    width;
    height;

    buttonGroups = [];
    collapsed = false;

    constructor(x,y,dx,dy,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.width = width;
        this.height = height;

        this.originPosition = new vector(x,y);
        this.targetPosition = new vector(dx,dy)
    }

    init() {
        this.addHierarchyButtons();
        this.addImportButton();
        this.addExportButton();
        this.addResetButton();
        this.addCollapseButton();
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
            let scene = new SelectMenuSubScene(225, 100, null,null, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentSummoner = scene.selected;

                updateQueryParams("summoner="+currentSummoner.id);
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
            let scene = new SelectMenuSubScene(225, 100,null,null, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentSummon = scene.selected;

                updateQueryParams("summoner="+currentSummoner.id + "&summon="+currentSummon.id);

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
            let scene = new SelectMenuSubScene(225, 100,null,null, 450 ,250, btn);

            scene.callBack = (scene) => {

                currentAction = scene.selected;
                updateQueryParams("summoner="+currentSummoner.id + "&summon="+currentSummon.id+"&action="+currentAction.id);

                scene.originBtn.selected = false;
                scene.originBtn.renderer.subImage = 0;
                this.collapse(this.buttonGroups.find(bg => bg.name == "collapse").buttons[0]);
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

        let translatedMousePos = new vector(GameInput.mousePosition.x - this.position.x, GameInput.mousePosition.y-this.position.y);



        if(translatedMousePos.x < -100 || translatedMousePos.y < -100 || translatedMousePos.x > this.width + 100 || translatedMousePos.y > this.height + 100) {
            return;
        }

        if(GameInput.mouseHeld().left) {
            return;
        }

        this.buttonGroups.forEach(bg => bg.hover(translatedMousePos));
    }


    addCloseButton() {
        let buttonGroup = new ButtonGroup();

        let xButton = new Button(0,0, this.game.images.buttonX);
        xButton.transform.scale = new vector(.6,.6);
        xButton.transform.position = new vector(this.width - xButton.transform.size.x/2, xButton.transform.size.y/2);
        xButton.held = (btn) => {
            buttonGroup.held(btn);

            this.close();
        };

        this.addObject(xButton);

        buttonGroup.addButton(xButton);

        this.buttonGroups.push(buttonGroup);
    }

    close() {
        this.originBtn.selected = false;
        this.originBtn.renderer.subImage = 0;
        this.destroy();
    }

    addCollapseButton() {
        let buttonGroup = new ButtonGroup();
        buttonGroup.name="collapse";

        let collapseButton = new Button(0,0, this.game.images.buttonLeft);
        collapseButton.transform.scale = new vector(.6,.6);
        collapseButton.transform.position = new vector(this.width - collapseButton.transform.size.x/2, collapseButton.transform.size.y/2);
        
        collapseButton.held = (btn) => {
            buttonGroup.held(btn);
        };

        collapseButton.clicked = (btn) => {

            this.collapse(btn);
        }

        this.addObject(collapseButton);
        buttonGroup.addButton(collapseButton);
        this.buttonGroups.push(buttonGroup);
    }

    collapse(btn) {
        this.createTween(this.determineVector() ,800, null, this).start();
        this.flipCollapseButton(btn);
        this.collapsed = this.toggle(this.collapsed);
        this.getChildScenes().forEach(scene => scene.close());
    }

    toggle(bool) {
        return !bool;
    }

    determineVector() {
        if(this.collapsed) {
            return this.originPosition;
        } else {
            return this.targetPosition;
        }
    }

    flipCollapseButton(btn) {
        if(btn.renderer.sprite == this.game.images.buttonRight) {
            btn.renderer.sprite = this.game.images.buttonLeft;
        } else {
            btn.renderer.sprite = this.game.images.buttonRight;
        }
    }

    createTween (target, time, onDone, context)
    {
        let tween = new TWEEN.Tween(context.position)
            .to({ x: target.x, y: target.y }, time)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { context.activeTween = null; onDone && onDone.call(context); });
        return tween.onStart(() => context.stopActiveTween(tween));
    }

    stopActiveTween (tween)
    {
        if (this.activeTween) 
        {
            this.activeTween.stop();
        }
        this.activeTween = tween;
    }
}