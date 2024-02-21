import {diagram, preferences} from "./data.js";
import {selectElements} from "./widgets.js";

export class Graph {
    parents
    children = []
    hidden = false
    selected = false
    movable = true
    color

    constructor(...parents) {
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

    constructor(x, y, ...parents) {
        super(...parents)
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
        context.strokeStyle = this.movable ? this.color : 'gray'
        context.lineWidth = this.size / 4 + 2
        context.fillStyle = this.selected ? 'lightgrey' : this.filled ? this.color : 'white'
        context.beginPath()
        context.arc(mapX(this.x), mapY(this.y), this.size, 0, Math.PI * 2)
        context.closePath()
        context.stroke()
        context.fill()
        if (this.showTag) {
            context.font = this.font
            context.fillText(this.tag, mapX(this.x + this.tagX), mapY(this.y + this.tagY))
        }
        if (this.selected) {
            context.beginPath()
            context.arc(mapX(this.x), mapY(this.y), this.size + context.lineWidth, 0, Math.PI * 2)
            context.closePath()
            context.strokeStyle = 'lightgrey'
            context.lineWidth /= 2
            context.stroke()
        }
    }

    reposition(deltaX, deltaY) {
        if (!this.movable) {
            return
        }
        if (this.parents.length === 0) {
            this.x += deltaX
            this.y += deltaY
        }
    }
}

export class StraightLine extends Graph {
    a
    b
    c
    type
    width

    constructor(dot0, dot1, type) {
        super(dot0, dot1)
        this.a = dot0.y - dot1.y
        this.b = dot1.x - dot0.x
        this.c = dot0.x * dot1.y - dot1.x * dot0.y
        this.type = type
        this.color = preferences.color
        this.width = preferences.width
    }

    draw() {

    }

    by(x, y) {
        return this.a * x + this.b * y + this.c > 0
    }
}

export class Circle extends Graph {
    x
    y
    r

    constructor(center, dot) {
        super(center, dot)
        this.x = center.x
        this.y = center.y
        this.r = distance(this.x, this.y, dot.x, dot.y)
    }

    in(x, y) {
        return distance(this.x, this.y, x, y) < this.r
    }
}

const canvas = document.getElementsByTagName('canvas')[0]
const context = canvas.getContext('2d')
let width
let height
let ratio
let originX = 0
let originY = 0
let scale = 1
let selectList = []

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
    for (const circle of diagram.circles) {
        circle.draw()
    }
    for (const dot of diagram.dots) {
        dot.draw()
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2)
}

let previousX
let previousY

function save(x, y) {
    previousX = x
    previousY = y
}

function moveCanvas(ev) {
    save(ev.pageX, ev.pageY)
    document.onmousemove = (ev) => {
        translate(ev.pageX - previousX, ev.pageY - previousY)
        save(ev.pageX, ev.pageY)
        draw()
    }
}

let operate = (ev) => {
}

export function struct(tool) {
    if (tool === 'move') {
        operate = (ev) => {
            //todo 线的移动
            selectList = selectElements(mapRX(ev.pageX - 4), mapRY(ev.pageY - 4), mapRX(ev.pageX + 4), mapRY(ev.pageY + 4)).dots// selectElements(mapRX(ev.pageX), mapRY(ev.pageY))
            if (selectList.length === 0) {
                moveCanvas(ev)
            } else {
                const selected = selectList[0]
                save(ev.pageX, ev.pageY)
                document.onmousemove = (ev) => {
                    selected.reposition(mapR(ev.pageX - previousX), mapR(ev.pageY - previousY))
                    save(ev.pageX, ev.pageY)
                    draw()
                }
            }
        }
    } else if (tool === 'select') {
        operate = (ev) => {

        }
    }
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
            moveCanvas(ev)
        } else if (ev.buttons === 1) {
            operate(ev)
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
        selectElements(ev.offsetX, ev.offsetY, wanted)
    }
}