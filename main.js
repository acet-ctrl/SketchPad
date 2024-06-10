import {initData} from "./modules/geoobj.js";
import {initPage} from "./modules/page.js";
import {initSketchPad} from "./modules/draftarea.js";

await initData()
initPage()
initSketchPad()