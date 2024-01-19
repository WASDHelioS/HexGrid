class AddTileScene extends SelectMenuMainScene {

    originBtn;
    callBack;
    closeCallBack;
    newObj = {};
    input;
    focus;

    inputFields = []; // contains {property, func}
    addedFields = [];

    constructor(x,y,dx,dy,width,height) {
        super(x,y,dx,dy,width,height,Scene.DisplayModes.absolute);
    }

    init(hexData) {
        this.input = hexData;
        this.addCloseButton();
        this.addSaveButton();
        this.createRadioButton(100, 50, 20,[{value:"off"},{value:"on"}], "enabled", hexData.oldPath);
        this.createInputField(100,200, "dice", hexData.dice);
    }

    createInputField(x,y, property, oldValue) {
        let inputFieldObjectFieldMap = {};
        let clickableField = new GameObject(x,y, this.game.images.input);
        clickableField.transform.scale = new vector(.1,.1);
        this.addObject(clickableField);

        let inputField = document.createElement("input");
        inputField.setAttribute("type","text");
        inputField.value = oldValue ? oldValue : "";
        document.body.appendChild(inputField);

        clickableField.draw = () => {
            GameObject.prototype.draw.call(clickableField);

            let ctx = this.cv_context;
            ctx.font = "10px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText(property + " : ", x-clickableField.transform.size.x /2, y + 5);

            ctx.textAlign = "left";
            ctx.fillText(inputField.value, x-clickableField.transform.size.x /2 + 5, y + 5);
        }

        clickableField.onClick = () => {
            inputField.focus();
            this.focus = inputField;
        }

        inputFieldObjectFieldMap.prop = property;
        inputFieldObjectFieldMap.input = () => inputField.value;
        this.inputFields.push(inputFieldObjectFieldMap);
        this.addedFields.push(inputField);
    }

    createRadioButton(x,y,spacing,opts,targetProperty, oldPath) {
        let buttonGroup = new RadioButtonGroup();
        let htmlFields = [];

        for(let i = 0; i < opts.length; i++) {
            let radioButton = new GameObject(x, y + (spacing * i), this.game.images.radioOff);
            radioButton.id = i;
            radioButton.name = opts[i].value
            radioButton.transform.scale = new vector(.03,.03);
            this.addObject(radioButton);
            
            let htmlButton = document.createElement("input");

            htmlButton.setAttribute("type","radio");
            htmlButton.setAttribute("name",targetProperty);
            htmlButton.setAttribute("value", opts[i].value);
            htmlButton.id = ""+ targetProperty + i
            htmlFields.push(htmlButton);
            this.addedFields.push(htmlButton);
            document.body.appendChild(htmlButton);

            radioButton.draw = () => {
                GameObject.prototype.draw.call(radioButton);
                let ctx = this.cv_context;
                ctx.font = "10px Verdana";
                ctx.fillStyle = "black";

                if(radioButton.id == 0) {
                    ctx.textAlign = "right";
                    ctx.fillText(targetProperty + " : ", x - radioButton.transform.size.x /2, y + 5);
                }
                
                ctx.textAlign = "left";
                ctx.fillText(opts[i].value, x - radioButton.transform.size.x + 30, y + spacing*i + 5);

            }
            
            radioButton.onClick = () => {
                buttonGroup.manageSelect(radioButton);
                htmlFields.forEach(e => e.checked = false);
                htmlButton.checked = true;
            }
            buttonGroup.addButton(radioButton);
        }

        if(oldPath) {
            buttonGroup.findByName("on").onClick();
        } else {
            buttonGroup.findByName("off").onClick();
        }

        let obj = {};
        obj.prop = targetProperty;
        obj.input = () => htmlFields.find((e) => e.checked).value;

        this.inputFields.push(obj);
    }

    addSaveButton() {
        let buttonGroup = new ButtonGroup();

        let btn = new Button(0,0, this.game.images.button);
        btn.transform.scale = new vector(.6,.6);
        btn.transform.position = new vector(btn.transform.size.x/2, this.height - btn.transform.size.y/2);
        btn.name = "Save";
        btn.clicked = (btn) => {
            
            this.inputFields.forEach(map => {
                this.newObj[map.prop] = map.input();
            });
            this.addedFields.forEach(e => e.remove());

            this.input.mod = this.newObj;

            this.callBack && this.callBack(this.input);
            this.close();
        };

        this.addObject(btn);

        buttonGroup.addButton(btn);

        this.buttonGroups.push(buttonGroup);
    }

    close() {
        this.closeCallBack && this.closeCallBack(this.input);
        this.destroy();
    }

    onUpdateSelected() {
        this.destroy();
    }

    onUpdateState() {
        this.destroy();
    }
}