class BackgroundScene extends Scene
{
    drawn = false;

    constructor (x, y, width, height, displayMode = 0)
    {
        super(x, y, width, height, displayMode);
    }

    draw ()
    {
        if (!this.drawn)
        {
            super.draw();
            this.drawn = true;
        }
    }
}