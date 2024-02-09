export class Graph {
    static draw
    static distance
    static fetch
    static reposition
    parents: Graph[]
    children: Graph[] = []
    hidden = false
    movable = true
    color = 'rgb(21,101,192)'
    tag = ''
    font = '1.5pc Latin Modern Math'
    showTag: boolean

    constructor(parents: Graph[]) {
        this.parents = parents
    }
}

export class Dot extends Graph {
    x: number
    y: number
    size = 4
    filled = false
    tagX = 10
    tagY = -10
    position = 0

    constructor(x: number, y: number, parents: Graph[]) {
        super(parents)
        this.x = x
        this.y = y
    }

    static draw = (dot: Dot) => {
        if (dot.hidden) {
            return
        }
        context.strokeStyle = dot.movable ? dot.color : 'grey'
        context.lineWidth = dot.size / 4 + 1
        context.fillStyle = dot.filled ? dot.color : 'white'
        context.beginPath()
        context.arc(mapX(dot.x), mapY(dot.y), dot.size, 0, Math.PI * 2)
        context.closePath()
        context.stroke()
        context.fill()
        if (dot.showTag) {
            context.font = dot.font
            context.fillText(dot.tag, mapX(dot.x + dot.tagX), mapY(dot.y + dot.tagY))
        }
    }
    static distance = (dot: Dot, x: number, y: number) => {
        return mapR(Math.sqrt((dot.x - x) ^ 2 + (dot.y - y) ^ 2))
    }
}

export class Line extends Graph {

}

export class StraightLine extends Line {
    a
    b
    c

    constructor(dot0, dot1) {
        super(dot0)
    }

    distance = (x, y) => {
        return mapR(Math.abs(this.a * x + this.b * y + this.c) / Math.sqrt(this.a ^ 2 + this.b ^ 2))
    }

    draw = () => {

    }
}

export class Circle extends Line {
    c
    r
}