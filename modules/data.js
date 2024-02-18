import {Dot} from "./sketchpad.js";

export let preferences
export let tools
export let diagram = {
    dots: [],
    lines: []
}

export async function initData() {
    fetch('/profile/preferences.json').then((r) => r.json()).then((r) => preferences = r).then(() => diagram.dots.push(new Dot(100, 100, [])))
    await fetch('/profile/tools.json').then((r) => r.json()).then((r) => tools = r)
}