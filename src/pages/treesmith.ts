import {renderApp, setPageIcon, setPageName} from "./common.ts";
import wynntreeIcon from "../../assets/img/icons/wynntree.png";

export function showTreeSmith() {
    setPageName("EffectSmith");
    setPageIcon(wynntreeIcon);
    renderApp(...getPageContent())
}

function getPageContent(): Node[] {



    return [];
}