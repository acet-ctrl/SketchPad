import {Circle, Dot, Line, StraightLine} from "./sketchpad"

const preferences = {
    color: 'rgb(21,101,192)',
    showTag: false,
    font: 'Latin Modern Math'
}
export const dots = [new Dot(0, 0, [])]
export const lines = []
const jp = JSON.stringify(preferences)
function select(x, y, type) {
    //TODO
    const result = []
    return result
}

function get(x, y, type) {
    if (type === Dot) {
        let selected = select(x, y, Line)
        if (selected.length === 0) {
            return new Dot(x, y, [])
        } else if (selected.length === 1) {
            const line = selected[0]
            const dots = line.parents
            if (line instanceof StraightLine) {
                const x0 = (line.b ^ 2 * x - line.a * line.b * y - line.a * line.c) / (line.a ^ 2 + line.b ^ 2)
                const y0 = (line.a ^ 2 * y - line.a * line.b * x - line.b * line.c) / (line.a ^ 2 + line.b ^ 2)
                const dot = new Dot(x, y, [line])
                dot.position = dots[0].x === dots[1].x ? (y0 - dots[1].y) / (dots[0].y - dots[1].y) : (x0 - dots[1].x) / (dots[0].x - dots[1].x)
                return dot
            } else if (line instanceof Circle) {
                const angle = Math.atan2(y - line.c, x - line.c)
                const dot = new Dot(line.c + line.r * Math.cos(angle), line.c + line.r * Math.sin(angle), [line])
                dot.position = angle
                return dot
            }
        } else {

        }
    }
}
