class SelectedScene extends Scene {

    constructor(x,y,width,height) {
        super(x,y,width,height,Scene.DisplayModes.absolute);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();

        if(currentSummoner) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText("Summoner : " + currentSummoner.name, 0, this.height / 2);
        }

        if(currentSummon) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Summon : " + currentSummon.name, this.width / 2, this.height / 2);
        }

        if(currentAction) {
            let ctx = this.cv_context;
            ctx.font = "15px Verdana";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.fillText("Action : " + currentAction.name, this.width, this.height / 2);
        }
    }
}