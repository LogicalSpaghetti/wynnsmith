import {addInputListeners, addSettingsListeners} from "./smith/input_listeners";
import {initDocumentHistory} from "./change_handling/history.ts";
import {AbilityTree} from "./ability/tree/ability_tree.ts";
import {maxPlayerLevel} from "./to_sort/small_stuff.ts";
import {ItemParser} from "./item/item_parser.ts";
import "style.css"
import './router';

// code entry point:
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadSite);
} else {
    loadSite();
}
window.addEventListener("DOMContentLoaded", loadSite);

function loadSite() {
    console.log("loading project");
    // TODO:
    //  read Link
    //  parse Build from Link
    //  Initialize Input HTML values from Link
    addInputListeners();
    addSettingsListeners();
}

const parser = new ItemParser();

document.getElementById("item_inputs")?.prepend(parser.itemHolder());
document.getElementById("tome_inputs")?.prepend(parser.tomeHolder());
document.getElementById("sp_section")?.appendChild(parser.spHolder());

const tree = new AbilityTree("archer", maxPlayerLevel);
document.getElementById("ability_tree")?.appendChild(tree.holder());

const ledger = initDocumentHistory();
ledger.register(parser, tree);

const html = "" +
    "<div class=\"sidenav\">\n" +
    "  <div>\n" +
    "    <button popovertarget=\"settings\" popovertargetaction=\"show\">\n" +
    "      <img src=\"/img/icons/yay.png\" alt=\"settings\" class=\"settings\">\n" +
    "      <b>Settings</b>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <hr>\n" +
    "    <a href=\"/tree\" target=\"_blank\">\n" +
    "      <img src=\"/img/icons/wynntree_clear.png\" alt=\" \">\n" +
    "      <b>Wynntree</b>\n" +
    "    </a>\n" +
    "    <hr>\n" +
    "    <a href=\"https://www.wynnpool.com/\" target=\"_blank\">\n" +
    "      <img src=\"/img/icons/wynnpool.ico\" alt=\" \">\n" +
    "      <b>Wynnpool</b>\n" +
    "    </a>\n" +
    "    <a href=\"https://punscake.github.io/wynnability\" target=\"_blank\">\n" +
    "      <img src=\"/img/icons/wynnability_clear.png\" alt=\" \">\n" +
    "      <b>Wynnability</b>\n" +
    "    </a>\n" +
    "    <a href=\"https://wynnmana.github.io/\" target=\"_blank\">\n" +
    "      <img src=\"/img/icons/yay.png\" alt=\" \">\n" +
    "      <b>Wynnmana</b>\n" +
    "    </a>\n" +
    "    <br>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div id=\"content\" style=\"margin-left: 6ch\">\n" +
    "  <div class=\"flexCol\">\n" +
    "    <!-- Column -->\n" +
    "    <section>\n" +
    "      <div class=\"m1\">\n" +
    "        <div>AP: <span id=\"assigned_ap_display\">0</span>/<span id=\"max_ap_display\">45</span> AP</div>\n" +
    "        <div id=\"ability_tree\"></div>\n" +
    "        <br>\n" +
    "        <button id=\"clear_tree\">Clear Tree</button>\n" +
    "        <button id=\"clear_reds\">Clear Errors</button>\n" +
    "        <br>\n" +
    "        <button id=\"ansi_tree\" class=\"copy_button\" data-default=\"Copy ANSI Tree\">Copy ANSI Tree</button>\n" +
    "        <br>\n" +
    "        <button id=\"tree_img\" class=\"copy_button\" data-default=\"Copy Tree as Image\" hidden>Copy Tree as Image\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "    <!-- Column -->\n" +
    "    <section>\n" +
    "      <div id=\"item_inputs\" class=\"inputs_holder\">\n" +
    "        <div id=\"gif_holder\"><img id=\"miku\" src=\"\" alt=\"\"/></div>\n" +
    "        <label for=\"level_input\">Level:</label>\n" +
    "        <input type=\"number\" inputmode=\"numeric\"\n" +
    "               min=\"1\" max=\"106\"\n" +
    "               id=\"level_input\" class=\"input level_input hide_number_increment\" placeholder=\"level\"\n" +
    "               value=\"106\"/>\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div class=\"copy_buttons\">\n" +
    "        <button id=\"copy_short\" class=\"copy_button\" data-default=\"Copy Link\">Copy Link</button>\n" +
    "        <button id=\"copy_long\" class=\"copy_button\" data-default=\"Share Build\">Share Build</button>\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div id=\"sp_section\" style=\"display: flex\"></div>\n" +
    "      <br>\n" +
    "      <button id=\"balance_dmg\">Balance Str/Dex</button>\n" +
    "      <br>\n" +
    "      <br>\n" +
    "      <div id=\"aspects_background\" style=\"margin-left: 1ch\">\n" +
    "        <div id=\"active_aspects\">\n" +
    "        </div>\n" +
    "        <div id=\"inactive_aspects\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div id=\"tome_inputs\"></div>\n" +
    "    </section>\n" +
    "    <!-- Column -->\n" +
    "    <section class=\"m1\">\n" +
    "      <div id=\"support_display\">\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <button popovertarget=\"edit_identifications\" popovertargetaction=\"show\">Edit Identifications</button>\n" +
    "      <br>\n" +
    "      <div id=\"warnings\" class=\"fire medium-font m1\" style=\"text-wrap: wrap; width: 35ch;\">\n" +
    "        Warnings!\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div id=\"effects_holder\" style=\"width: 24ch\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "          <label for=\"effect_toggles\">Active Effects:</label>\n" +
    "        </div>\n" +
    "        <div id=\"effect_toggles\">\n" +
    "        </div>\n" +
    "        <div id=\"effect_sliders\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <br>\n" +
    "      <div style=\"background-color: #181818; text-align: center\">\n" +
    "        <b id=\"equip_order\"></b>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "    <!-- Column -->\n" +
    "    <section>\n" +
    "      <button popovertarget=\"compare_section\" popovertargetaction=\"show\">Compare Build...</button>\n" +
    "      <div class=\"m1\">\n" +
    "        <div id=\"attack_display\">\n" +
    "          <div class=\"attack-holder\">\n" +
    "            Input Weapon\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div popover id=\"settings\">\n" +
    "  <div>\n" +
    "    <input id=\"selvs\" type=\"checkbox\">\n" +
    "    <label for=\"selvs\">Display Damage in Selvs</label>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <input id=\"detailed_damage\" type=\"checkbox\">\n" +
    "    <label for=\"detailed_damage\">Show Detailed Damage</label>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <label for=\"gif_input\">Set GIF:</label>\n" +
    "    <input accept=\"image/gif\" id=\"gif_input\" type=\"file\"/>\n" +
    "    <br><br>\n" +
    "    <label for=\"opacity_slider\">GIF Opacity:</label>\n" +
    "    <input id=\"opacity_slider\" class=\"slider\" type=\"range\" value=\"15\" style=\"width: 210px\"/>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "  </div>\n" +
    "  <br>\n" +
    "  <button popovertarget=\"settings\" popovertargetaction=\"hide\">Close Settings</button>\n" +
    "  <br><br><br><br>\n" +
    "  <div id=\"dev_output\" class=\"output font-minecraft\"></div>\n" +
    "</div>\n" +
    "<div popover id=\"compare_section\">\n" +
    "  <h1>Compare build to</h1>\n" +
    "  <div style=\"display: inline-block;\">\n" +
    "    Compare to Offhand:\n" +
    "    <br>\n" +
    "    <select id=\"offhand_select\">\n" +
    "      <option value=\"\">-none-</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "  <div style=\"display: inline-block;\">\n" +
    "    Compare to link:\n" +
    "    <br>\n" +
    "    <input placeholder=\"paste link here\" type=\"text\" id=\"second_build_link\">\n" +
    "  </div>\n" +
    "  <br>\n" +
    "  <br>\n" +
    "  <button popovertarget=\"compare_section\" popovertargetaction=\"hide\">Close</button>\n" +
    "</div>\n" +
    "<div popover id=\"edit_identifications\">\n" +
    "  <h1>TODO</h1>\n" +
    "  <br>\n" +
    "  <br>\n" +
    "  <button popovertarget=\"edit_identifications\" popovertargetaction=\"hide\">Close</button>\n" +
    "</div>";
