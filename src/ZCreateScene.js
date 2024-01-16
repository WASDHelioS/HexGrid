class CreateScene extends SelectMenuMainScene {

    originBtn;
    callBack;
    focus;
    newObj;
    level;

    inputFields = []; // contains {input, objectField}

    constructor(x,y,width,height, button) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.originBtn = button;
    }

    init(objRoot, level) {
        this.level = level;
        this.newObj = {};
        this.newObj.id = nextId(objRoot);

        if(level == "summoner") {
            this.newObj.summons = [];
            this.createButton();
            this.createInputField(80,80,80,80,this.newObj.name);
        } else if(level == "summon") {
            this.newObj.actions = [];

            // create base summon + construct input fields for summon
        } else {
            //create base action. immediately select + right side window
        }
    }

    createInputField(x,y, objectFieldReference) {
        let inputFieldObjectFieldMap = {};
        let clickableField = new GameObject(x,y, this.game.images.input);
        clickableField.transform.scale = new vector(.1,.1);
        this.addObject(clickableField);

        let inputField = document.createElement("input");
        inputField.setAttribute("type","text");
        document.body.appendChild(inputField);

        clickableField.draw = () => {
            GameObject.prototype.draw.call(clickableField);

            let ctx = this.cv_context;
            ctx.font = "10px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText("test : " + inputField.value ,x-clickableField.transform.size.x/2, y - clickableField.transform.size.y/2);
        }

        clickableField.onClick = () => {
            inputField.focus();
            this.focus = inputField;
        }

        inputFieldObjectFieldMap.input = inputField;
        inputFieldObjectFieldMap.objectField = objectFieldReference;
        this.inputFields.push(inputFieldObjectFieldMap);
    }

    createButton() {
        let buttonGroup = new ButtonGroup();

        let btn = new Button(0,0, this.game.images.button);
        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x/2, this.height - btn.transform.size.y/2);
        btn.name = "Create";
        btn.held = (btn) => {
            buttonGroup.held(btn);

            this.originBtn.selected = false;
            this.originBtn.renderer.subImage = 0;
            
            this.callBack && this.callBack(this, this.newObj);
        };

        this.addObject(btn);

        buttonGroup.addButton(btn);

        this.buttonGroups.push(buttonGroup);
    }

    draw() {
        super.draw();
        if(!this.newObj) {
            return;
        }
        let ctx = this.cv_context;
        ctx.font = "10px Verdana";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.fillText("ID: " + this.newObj.id ,40, 40);

        ctx.fillText("Create a " + this.level, 20,20);
    }

    destroy() {
        super.destroy();

        console.log(this.inputFields);
        this.inputFields.forEach(map => {
            console.log(map);
            map.objectField = map.input;
            map.input.remove();
        });
    }
}