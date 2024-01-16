class ButtonGroup {

    buttons = [];
    selectedInGroup;

    addButton(button) {
        this.buttons.push(button);
        if(!button.selectable) {
            button.renderer.subImage = 4;
        }
    }

    hover(mousePos) {
        this.buttons.forEach(button => {
            if(button.selected) {
                return;
            }

            if(!button.selectable) {
                button.renderer.subImage = 4;
                return;
            }

            if(this.isWithin(mousePos, button)) {
                button.renderer.subImage = 1;
            } else {
                button.renderer.subImage = 0;
                
            }
        });
    }

    held(btn) {
        if(btn.isClicked) {
            btn.renderer.subImage = 2;
        }
    }

    isWithin(mousePos, button) {
        return mousePos.x > button.transform.position.x - button.transform.size.x / 2 && 
            mousePos.x < button.transform.position.x + button.transform.size.x / 2 &&
            mousePos.y > button.transform.position.y - button.transform.size.y / 2&&
            mousePos.y < button.transform.position.y + button.transform.size.y / 2;
    }

    manageSelect(btn) {
        this.buttons.forEach(button => {
            if(button === btn && button.selectable) {
                button.renderer.subImage = 3;
                button.selected = true;
                this.selectedInGroup = button;
            } else {
                if(button.selectable) {
                    button.renderer.subImage = 0;
                    button.selected = false;
                }
            }
        });
    }
}