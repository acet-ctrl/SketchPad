import {Dot} from "./sketchpad.js";

export let preferences
export let tools
export let diagram = {
    dots: [],
    lines: [],
    circles: []
}

export async function initData() {
    fetch('/profile/preferences.json').then((r) => r.json()).then((r) => preferences = r).then(() => diagram.dots.push(new Dot(100, 100), new Dot(0, 0)))
    await fetch('/profile/tools.json').then((r) => r.json()).then((r) => tools = r)
}