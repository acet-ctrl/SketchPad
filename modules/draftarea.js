import {diagram, Dot, preferences} from "./geoobj.js";
import {selectElements} from "./utils.js";

const draftArea = {}
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

function zoom(isMagnifying, x, y) {
    let rate = 1.05
    let id = isMagnifying ?
        setInterval(() => {
            scale *= rate
            translate((x - originX) * (1 - rate), (y - originY) * (1 - rate))
            refresh()
            rate -= 0.004
        }, 20) :
        setInterval(() => {
            scale /= rate
            translate((x - originX) * (1 - 1 / rate), (y - originY) * (1 - 1 / rate))
            refresh()
            rate -= 0.004
        }, 20)
    setTimeout(() => {
        clearInterval(id)
    }, 250)
}

function draw(graph) {
    if (graph instanceof Dot) {
        if (graph.isHidden) {
            return
        }
        context.strokeStyle = graph.isMovable ? graph.color : 'darkgray'
        context.lineWidth = graph.size / 4 + 2
        context.fillStyle = graph.isSelected ? 'lightgrey' : graph.isFilled ? graph.color : 'white'
        context.beginPath()
        context.arc(mapX(graph.x), mapY(graph.y), graph.size, 0, Math.PI * 2)
        context.closePath()
        context.stroke()
        context.fill()
        if (graph.isLabelled) {
            context.font = graph.tagFont
            context.fillText(graph.tag, mapX(graph.x + graph.tagX), mapY(graph.y + graph.tagY))
        }
        if (graph.isSelected) {
            context.beginPath()
            context.arc(mapX(graph.x), mapY(graph.y), graph.size + context.lineWidth, 0, Math.PI * 2)
            context.closePath()
            context.strokeStyle = 'lightgrey'
            context.lineWidth /= 2
            context.stroke()
        }
    }
    else if (graph instanceof )
}

function refresh() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const graphs of diagram) {
        for (const graph in graphs) {
            draw(graph)
        }
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2)
}

function select(elements) {
    for (const element of elements) {

    }
}

let previousX
let previousY

function save(x, y) {
    previousX = x
    previousY = y
}

function moveCanvas(ev) {
    document.onmousemove = (ev) => {
        save(ev.pageX, ev.pageY)
        translate(ev.pageX - previousX, ev.pageY - previousY)
        refresh()
    }
}

let drag
let click

export function struct(tool) {
    switch (tool) {
        case 'move':
            drag = (ev) => {
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
                        refresh()
                    }
                }
            }
            click = (ev) => {

            }
            break
        case 'select':
            drag = (ev) => {

            }
            break
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
        refresh()
    }
    canvas.onmousedown = (ev) => {
        if (ev.buttons === 2) {
            moveCanvas(ev)
        } else if (ev.buttons === 1) {
            drag(ev)
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