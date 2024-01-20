class EditMenuMainScene extends SelectMenuMainScene {

    originWidth;
    targetWidth;
    parentWidth;
    hidden = true;
    
    constructor(x,y,dx,dy,width,height, parentWidth, parentHeight) {
        super(parentWidth,y,dx,dy,0,height,Scene.DisplayModes.absolute);
        this.originPosition = new vector(x,y);
        this.originWidth = width;
        this.targetWidth = 35;

        this.parentWidth = parentWidth;
    }

    init(selected) {

        this.addCollapseButton();
        this.addEditButton();

        this.show();
    }

    hide() {
        if(this.hidden == true) return;
        this.hidden = true;
        let tween = new TWEEN.Tween(this.position)
            .to({ x: this.parentWidth, y: this.originPosition.y }, 800)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { this.activeTween = null; this.onDone && this.onDone.call(this); });

        let sizeTween = new TWEEN.Tween(this.size)
            .to({ x: 0}, 800)
            .easing(TWEEN.Easing.Bounce.Out);
    
        tween.onStart(() => {this.stopActiveTween(tween); sizeTween.start()});
        tween.start();

        this.buttonGroups.forEach((bg) => { bg.buttons.forEach(btn => btn.selectable=false)});
    }

    show() {
        if(!this.hidden) return;
        this.hidden = false;
        let tween = new TWEEN.Tween(this.position)
            .to({ x: this.originPosition.x, y: this.originPosition.y }, 800)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { this.activeTween = null; this.onDone && this.onDone.call(this); });

        let sizeTween = new TWEEN.Tween(this.size)
            .to({ x: this.originWidth}, 800)
            .easing(TWEEN.Easing.Bounce.Out);
    
        tween.onStart(() => {this.stopActiveTween(tween); sizeTween.start()});
        tween.start();

        this.buttonGroups.forEach((bg) => { bg.buttons.forEach(btn => btn.selectable=true)});
        this.buttonGroups.find(bg => bg.name == "collapse").buttons[0].renderer.sprite=this.game.images.buttonRight;
        this.collapsed=false;
    }

    addEditButton() {
        let editRangeButton = new Button(100,100, this.game.images.button);
        let editTargetButton = new Button(100, 150, this.game.images.button);
        let viewButton = new Button(100, 50, this.game.images.button);

        editRangeButton.transform.scale = new vector(0.6,.7);
        editRangeButton.setName("Edit Range");
        editRangeButton.textSize = 14;

        editTargetButton.transform.scale = new vector(0.6,.7);
        editTargetButton.setName("Edit Targets");
        editTargetButton.textSize = 14;

        viewButton.transform.scale = new vector(0.6,.7);
        viewButton.setName("View");
        viewButton.textSize = 14;

        this.addObject(editRangeButton);
        this.addObject(editTargetButton);
        this.addObject(viewButton);

        editRangeButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        editRangeButton.clicked = (btns) => {
            this.collapse(this.buttonGroups.find(bg=>bg.name=="collapse").buttons[0]);
            currentState.set('EDIT_RANGE');
        }

        editTargetButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        editTargetButton.clicked = (btns) => {
            this.collapse(this.buttonGroups.find(bg=>bg.name=="collapse").buttons[0]);
            currentState.set('EDIT_TARGET');
        }

        viewButton.held = (btn) => {
            buttonGroup.held(btn);
        }

        viewButton.clicked = (btns) => {
            this.collapse(this.buttonGroups.find(bg=>bg.name=="collapse").buttons[0]);
            currentState.set('VIEW');
        }

        let buttonGroup = new ButtonGroup();

        buttonGroup.addButton(editRangeButton);
        buttonGroup.addButton(editTargetButton);
        buttonGroup.addButton(viewButton);

        this.buttonGroups.push(buttonGroup);
    }

    addCollapseButton() {
        let buttonGroup = new ButtonGroup();
        buttonGroup.name="collapse";

        let collapseButton = new Button(0,0, this.game.images.buttonRight);
        collapseButton.transform.scale = new vector(.6,.6);
        collapseButton.transform.position = new vector(collapseButton.transform.size.x/2, collapseButton.transform.size.y/2);

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

    createTween (target, time, onDone, context)
    {
        let tween = new TWEEN.Tween(context.position)
            .to({ x: target.x, y: target.y }, time)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => { context.activeTween = null; onDone && onDone.call(context); });

        let sizeTween = new TWEEN.Tween(context.size)
            .to({ x: this.determineWidth()}, time)
            .easing(TWEEN.Easing.Bounce.Out);

        return tween.onStart(() => {context.stopActiveTween(tween); sizeTween.start()});
    }

    determineWidth() {
        if(this.collapsed) {
            return this.originWidth;
        }
        return this.targetWidth;
    }

    handleMouse() {
        if(this.hidden) return;
        super.handleMouse();
    }

    onUpdateSelected(selected) {

    }
}