class Hex extends GameObject {

    borderAbs;
    radius;
    cube;

    constructor(x,y, image) {
        super(x,y,image,0);
        this.transform.scale = new vector(0.08,0.08);
    }

}