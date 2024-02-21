import {Circle, Dot, StraightLine} from "./sketchpad.js";
import {diagram} from "./data.js";

export function selectElements(x1, y1, x2, y2) {
    const result = {
        dots: [],
        lines: [],
        circles: []
    }
    for (const dot of diagram.dots) {
        if ((dot.x - x1) * (dot.x - x2) < 0 && (dot.y - y1) * (dot.y - y2) < 0) {
            result.dots.push(dot)
        }
    }
    for (const line of diagram.lines) {
        const a = line.by(x1, y1)
        const b = line.by(x1, y2)
        const c = line.by(x2, y1)
        const d = line.by(x2, y2)
        if (!(a && b && c && d) && (a || b || c || d)) {
            const x3 = line.parents[0].x
            const y3 = line.parents[0].y
            const x4 = line.parents[1].x
            const y4 = line.parents[1].y
            if (line.type === 0) {
                result.lines.push(line)
            } else if (!((x4 - x3) * (x3 - x2) > 0 && (x4 - x3) * (x3 - x1) > 0 || (y4 - y3) * (y3 - y2) > 0 && (y4 - y3) * (y3 - y1) > 0)) {
                if (line.type === 1) {
                    result.lines.push(line)
                } else if (!((x3 - x4) * (x4 - x2) > 0 && (x3 - x4) * (x4 - x1) > 0 || (y3 - y4) * (y4 - y2) > 0 && (y3 - y4) * (y4 - y1) > 0) && line.type === 2) {
                    result.lines.push(line)
                }
            }
        }
    }
    for (const circle of diagram.circles) {
        const a = circle.in(x1, y1)
        const b = circle.in(x1, y2)
        const c = circle.in(x2, y1)
        const d = circle.in(x2, y2)
        if (!(a && b && c && d) && (a || b || c || d)) {
            
        }
    }
    return result
}

export function get(x, y, type) {
    if (type === Dot) {
        let selected = selectElements(x, y, Line)
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
