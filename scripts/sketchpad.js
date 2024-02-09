import {Dot, Line} from "./elements";
import {dots, lines} from "./data";

const canvas = document.getElementsByTagName('canvas')[0]
const context = canvas.getContext('2d')
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