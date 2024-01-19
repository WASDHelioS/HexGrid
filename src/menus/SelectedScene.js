class SelectedScene extends Scene {

    constructor(x,y,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();

        //todo: change these into GameObject and update state onClick.

        if(currentSummoner.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText("Summoner : " + currentSummoner.get().name, 0, this.height / 2);
        }

        if(currentSummon.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Summon : " + currentSummon.get().name, this.width / 2, this.height / 2);
        }

        if(currentAction.get()) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText("Action : " + currentAction.get().name, this.width, this.height / 2);
        }
    }

    onUpdateSelected(selected) {

    }

    onUpdateState(st) {
        
    }
}