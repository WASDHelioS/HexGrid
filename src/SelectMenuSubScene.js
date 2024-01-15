class SelectMenuSubScene extends SelectMenuMainScene {

    originBtn;
    selected;
    callBack;

    constructor(x,y,width,height, originBtn) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.originBtn = originBtn;
    }

    init(src) {
        this.addOptionButtons(src);
        this.addSelectButton();
        this.addUpdateButton();
        this.addDeleteButton();
        this.addCloseButton();
    }

    addOptionButtons(src) {
        let btnGroup = new ButtonGroup();
        for(let i = 0; i < src.length; i++) {
            let obj = src[i];

            let btn = new Button(0,0,this.game.images.button);
            btn.setObj(obj);
            btn.transform.scale = new vector(.6,.6);
            btn.transform.position = new vector(btn.transform.size.x / 2 + (btn.transform.size.x * Math.floor(i / 5) + 1), 
                                                (btn.transform.size.y * 1.7) + (btn.transform.size.y * (i % 5)));

            btn.clicked = (btn) => {
                this.selected = btn.obj;
                btnGroup.manageSelect(btn);
            }

            btnGroup.addButton(btn);
            this.addObject(btn);
        }
        this.buttonGroups.push(btnGroup);
    }

    addSelectButton() {
        let btnGroup = new ButtonGroup();
        let btn = new Button(0,0, this.game.images.button);
        btn.setName("Select");

        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x / 2, this.height - btn.transform.size.y );

        btn.held = (btn) => {
            btnGroup.held(btn);

            if(!this.selected) {
                return;
            }

            this.callBack && this.callBack(this);
        };

        btnGroup.addButton(btn);
        this.addObject(btn);
        this.buttonGroups.push(btnGroup);

    }

    addUpdateButton() {

    }

    addDeleteButton() {

    }

    addCloseButton() {
        let buttonGroup = new ButtonGroup();

        let xButton = new Button(0,0, this.game.images.buttonX);
        xButton.transform.scale = new vector(.6,.6);
        xButton.transform.position = new vector(this.width - xButton.transform.size.x/2, xButton.transform.size.y/2);
        xButton.held = (btn) => {
            buttonGroup.held(btn);

            this.originBtn.selected = false;
            this.originBtn.renderer.subImage = 0;
            this.destroy();
        };

        this.addObject(xButton);

        buttonGroup.addButton(xButton);

        this.buttonGroups.push(buttonGroup);
    }

}