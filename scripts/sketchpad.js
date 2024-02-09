import {dots, lines} from "./data.js"

export class Graph {
    static draw
    static distance
    static fetch
    static reposition
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
    font = '1.5pc Latin Modern Math'
    showTag
    tagX = 10
    tagY = -10
    position = 0

    constructor(x, y, parents,color=) {
        super(parents)
        this.x = x
        this.y = y
    }

    static draw = (dot, context) => {
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
    static distance = (dot, x, y) => {
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

const canvas = document.getElementsByTagName('canvas')[0]
export const context = canvas.getContext('2d')
let width
let height
let ratio
let originX = 0
let originY = 0
let scale = 1
const mapX = (x) => {
    return originX + x * scale
}
const mapY = (y) => {
    return originY + y * scale
}
const mapR = (d) => {
    return d / scale
}
const mapRX = (offsetX) => {
    return mapR(offsetX - originX)
}
const mapRY = (offsetY) => {
    return mapR(offsetY - originY)
}
const translate = (deltaX, deltaY) => {
    originX += deltaX
    originY += deltaY
}
const zoom = (rate) => {
    scale *= rate
}
const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const line of lines) {
        Line.draw(line)
    }
    for (const dot of dots) {
        Dot.draw(dot)
    }
}

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
let previousX
let previousY

function save(x, y) {
    previousX = x
    previousY = y
}

canvas.onmousedown = (ev) => {
    if (ev.buttons === 2) {
        save(ev.offsetX, ev.offsetY)
        document.onmousemove = (ev) => {
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
    const rate = ev.deltaY < 0 ? 1.2 : 5 / 6
    zoom(rate)
    translate((ev.offsetX - originX) * (1 - rate), (ev.offsetY - originY) * (1 - rate))
    draw()
}
let wanted
canvas.onclick = (ev) => {
    if (ev.buttons === 1) {
        select(ev.offsetX, ev.offsetY, wanted)
    }
}