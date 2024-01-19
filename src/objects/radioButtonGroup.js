class RadioButtonGroup extends ButtonGroup {

    constructor() {
        super()
    }

    findByName(buttonName) {
        return this.buttons.find(button => button.name == buttonName);
    }

    addButton(button) {
        this.buttons.push(button);
    }

    hover(mousePos) {
        this.buttons.forEach(button => {
            if(button.selected) {
                return;
            }
        });
    }

    held(btn) {
    }

    isWithin(mousePos, button) {
        return mousePos.x > button.transform.position.x - button.transform.size.x / 2 && 
            mousePos.x < button.transform.position.x + button.transform.size.x / 2 &&
            mousePos.y > button.transform.position.y - button.transform.size.y / 2&&
            mousePos.y < button.transform.position.y + button.transform.size.y / 2;
    }

    manageSelect(btn) {
        this.buttons.forEach(button => {
            if(button === btn) {
                button.renderer.sprite = game.images.radioOn;
                this.selectedInGroup = button;
            } else {
                button.renderer.sprite = game.images.radioOff;
            }
        });
    }
}