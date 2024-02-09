import {Dot} from "./sketchpad";

const hideButton = document.getElementById('hide')
const showButton = document.getElementById('show')
const sideBar = document.getElementsByTagName('aside')[0]
const reservedBar = document.getElementsByClassName('reserved')[0]
hideButton.onclick = () => {
    sideBar.classList.replace('open-sidebar', 'close-sidebar')
    reservedBar.classList.replace('close-reserved', 'open-reserved')
}
showButton.onclick = () => {
    sideBar.classList.replace('close-sidebar', 'open-sidebar')
    reservedBar.classList.replace('open-reserved', 'close-reserved')
}
document.oncontextmenu = () => {
    return false
}
const moveTool=document.getElementById('move')
Dot.draw=()=>{

}