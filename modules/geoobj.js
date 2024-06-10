class Class {
    
}
export class GeoObject {
    parents
    generator
    children = []
    color
    isHidden = false
    isSelected = false
    isMovable = true

    constructor(generator, ...parents) {
        this.generator = generator
        this.parents = parents
    }

    reposition() {
        this.generator(this.parents)
        for (const child of this.children) {
            child.reposition()
        }
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }
}

export class Dot extends GeoObject {
    x
    y
    size
    isFilled
    isLabelled
    tag = ''
    tagFont
    tagX = 10
    tagY = -10

    constructor(x, y, generator, ...parents) {
        super(...parents)
        this.x = x
        this.y = y
        this.color = "rgb(21,101,192)"
        this.size = 4
        this.isFilled = false
        this.tagFont = "1.5pc Latin Modern Math"
        this.isLabelled = false
    }

    move(deltaX, deltaY) {
        if (!this.isMovable) {
            return
        }
        if (this.parents.length === 0) {
            this.x += deltaX
            this.y += deltaY
        } else if (this.parents[0] instanceof StraightLine) {
            
        } else {

        }
        this.reposition()
    }
}

export class StraightLine extends GeoObject {
    a
    b
    c
    //type
    width

    constructor(dot0, dot1) {
        super(dot0, dot1)
        this.a = dot0.y - dot1.y
        this.b = dot1.x - dot0.x
        this.c = dot0.x * dot1.y - dot1.x * dot0.y
        this.color = "rgb(21,101,192)"
        this.width = 2
    }

    by(x, y) {
        return this.a * x + this.b * y + this.c > 0
    }
}

export class Circle extends GeoObject {
    x
    y
    r

    constructor(center, dot) {
        super(center, dot)
        this.x = center.x
        this.y = center.y
        this.r = GeoObject.distance(this.x, this.y, dot.x, dot.y)
    }

    in(x, y) {
        return GeoObject.distance(this.x, this.y, x, y) < this.r
    }
}