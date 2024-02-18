const sideBar = document.getElementsByTagName('aside')[0]
const reservedBar = document.getElementsByClassName('reserved')[0]

export function initPage() {
    document.getElementById('hide').onclick = () => {
        sideBar.classList.replace('open-sidebar', 'close-sidebar')
        reservedBar.classList.replace('close-reserved', 'open-reserved')
    }
    document.getElementById('show').onclick = () => {
        sideBar.classList.replace('close-sidebar', 'open-sidebar')
        reservedBar.classList.replace('open-reserved', 'close-reserved')
    }
    document.oncontextmenu = () => {
        return false
    }
}