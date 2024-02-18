import {diagram, preferences} from "./data.js";

export class Graph {
    parents
    children = []
    hidden = false
    movable = true
    color

    constructor(parents) {
        this.parents = parents
    }
}

export class Dot extends Graph {
    x
    y
    size
    filled
    tag = ''
    font
    showTag
    tagX = 10
    tagY = -10
    position = 0

    constructor(x, y, parents) {
        super(parents)
        this.x = x
        this.y = y
        this.color = preferences.color
        this.size = preferences.size
        this.filled = preferences.filled
        this.font = preferences.font
        this.showTag = preferences.showTag
    }

    draw() {
        if (this.hidden) {
            return
        }
        context.strokeStyle = this.movable ? this.color : 'grey'
        context.lineWidth = this.size / 4 + 1
        context.fillStyle = this.filled ? this.color : 'white'
        context.beginPath()
        context.arc(mapX(this.x), mapY(this.y), this.size, 0, Math.PI * 2)
        context.closePath()
        context.stroke()
        context.fill()
        if (this.showTag) {
            context.font = this.font
            context.fillText(this.tag, mapX(this.x + this.tagX), mapY(this.y + this.tagY))
        }
    }

    distance(x, y) {
        return mapR(Math.sqrt((this.x - x) ^ 2 + (this.y - y) ^ 2))
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

    distance(x, y) {
        return mapR(Math.abs(this.a * x + this.b * y + this.c) / Math.sqrt(this.a ^ 2 + this.b ^ 2))
    }

    draw() {

    }
}

export class Circle extends Line {
    c
    r
}

const canvas = document.getElementsByTagName('canvas')[0]
const context = canvas.getContext('2d')
let width
let height
let ratio
let originX = 0
let originY = 0
let scale = 1

function mapX(x) {
    return originX + x * scale
}

function mapY(y) {
    return originY + y * scale
}

function mapR(d) {
    return d / scale
}

function mapRX(offsetX) {
    return mapR(offsetX - originX)
}

function mapRY(offsetY) {
    return mapR(offsetY - originY)
}

function translate(deltaX, deltaY) {
    originX += deltaX
    originY += deltaY
}

function zoom(isMagnify, x, y) {
    let rate = 1.05
    let id
    if (isMagnify) {
        id = setInterval(() => {
            scale *= rate
            translate((x - originX) * (1 - rate), (y - originY) * (1 - rate))
            draw()
            rate -= 0.004
        }, 20)
    } else {
        id = setInterval(() => {
            scale /= rate
            translate((x - originX) * (1 - 1 / rate), (y - originY) * (1 - 1 / rate))
            draw()
            rate -= 0.004
        }, 20)
    }
    setTimeout(() => {
        clearInterval(id)
    }, 250)
}

export function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const line of diagram.lines) {
        line.draw()
    }
    for (const dot of diagram.dots) {
        dot.draw()
    }
}

let previousX
let previousY

function save(x, y) {
    previousX = x
    previousY = y
}

export function initSketchPad() {
    window.onload = window.onresize = () => {
        width = window.innerWidth
        height = window.innerHeight
        ratio = window.devicePixelRatio
        canvas.width = width * ratio
        canvas.height = height * ratio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        context.scale(ratio, ratio)
        draw()
    }
    canvas.onmousedown = (ev) => {
        if (ev.buttons === 2) {
            save(ev.offsetX, ev.offsetY)
            document.onmousemove = (ev) => {
                ev.movementX
                translate(ev.offsetX - previousX, ev.offsetY - previousY)
                save(ev.offsetX, ev.offsetY)
                draw()
            }
        }
    }
    document.onmouseup = () => {
        document.onmousemove = null
    }
    canvas.onwheel = (ev) => {
        if (ev.ctrlKey) {
            return
        }
        zoom(ev.deltaY < 0, ev.offsetX, ev.offsetY)
    }
}


let wanted
canvas.onclick = (ev) => {
    if (ev.buttons === 1) {
        select(ev.offsetX, ev.offsetY, wanted)
    }
}