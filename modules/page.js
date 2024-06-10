import {struct} from "./draftarea.js";

const sideBar = document.getElementsByTagName('aside')[0]
const reservedBar = document.getElementsByClassName('reserved')[0]
const tools = document.getElementsByClassName('tool')
let currentTool

export function initPage() {
    document.getElementById('hide').onclick = () => {
        sideBar.classList.replace('open-sidebar', 'close-sidebar')
        reservedBar.classList.replace('close-reserved', 'open-reserved')
    }
    document.getElementById('show').onclick = () => {
        sideBar.classList.replace('close-sidebar', 'open-sidebar')
        reservedBar.classList.replace('open-reserved', 'close-reserved')
    }
    for (const tool of tools) {
        tool.onclick = () => {
            currentTool?.classList.remove('selected')
            tool.classList.add('selected')
            currentTool = tool
            struct(tool.id)
        }
    }
    tools[0].click()
}