class Button extends GameObject {

    hovered; // bool
    selected; //bool
    isClicked; // bool
    clicked; //func
    held; //func
    selectable = true; //bool
    obj;
    name;
    textSize = 10;

    constructor(x,y, image) {
        super(x,y,image,1);
    }

    setObj(obj) {
        this.obj = obj;
        this.name = obj.name;
    }

    setName(name) {
        this.name = name;
    }

    update (deltaTime) {
        super.update(deltaTime);

        if(!GameInput.g_mouseDown) {
            this.isClicked = false;
        }
    }

    draw() {
        super.draw();

        if(this.name) {
            let ctx = this.scene.cv_context;
            ctx.font = this.textSize + "px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.name,this.transform.position.x, this.transform.position.y);
        }
    }

    onClick(btns) {
        this.isClicked = true;
        if(this.selected || !this.selectable) {
            return;
        }
        if(btns.left) {
            this.clicked && this.clicked(this);
        }
    }

    onMouseHeld(btns) {
        if(this.isClicked) {
            if(this.selected || !this.selectable) {
                return;
            }
            if(btns.left) {
                this.held && this.held(this);
            }
        }
    }
}