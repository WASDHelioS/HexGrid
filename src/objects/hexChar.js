class HexChar extends Hex {
    
    direction;
    updateField;

    constructor(x,y, image, update) {
        super(x,y,image);
        this.direction = CubeDirection.N;
        this.updateField = update;
    }

    update (deltaTime) {
        super.update(deltaTime);
        if(state.state == 'VIEW') {
            if(GameInput.isPressed(GameInput.keys["e"])) {
                this.direction = direction_right(this.direction);
                
                this.transform.rotation = (this.transform.rotation + 60) % 360;

                this.updateField();

            } else if(GameInput.isPressed(GameInput.keys["q"])) {
                this.direction = direction_left(this.direction);
                this.transform.rotation = (this.transform.rotation - 60) % 360;

                this.updateField();

            } else if(GameInput.isPressed(GameInput.keys["s"])) {
                this.direction = direction_opposite(this.direction);
                this.transform.rotation = (this.transform.rotation + 180) % 360;

                this.updateField();
            }
        }
    }

}

const range_of_vision = {
    "STRAIGHT":["N"],
    "CONE":["N","NE","NW"],
    "WIDE":["N","NE", "SE", "NW","SW"],
    "ALL":["N","NE", "SE", "NW","SW", "S"],

}