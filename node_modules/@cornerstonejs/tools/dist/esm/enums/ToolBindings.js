var MouseBindings;
(function (MouseBindings) {
    MouseBindings[MouseBindings["Primary"] = 1] = "Primary";
    MouseBindings[MouseBindings["Secondary"] = 2] = "Secondary";
    MouseBindings[MouseBindings["Primary_And_Secondary"] = 3] = "Primary_And_Secondary";
    MouseBindings[MouseBindings["Auxiliary"] = 4] = "Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Auxiliary"] = 5] = "Primary_And_Auxiliary";
    MouseBindings[MouseBindings["Secondary_And_Auxiliary"] = 6] = "Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Secondary_And_Auxiliary"] = 7] = "Primary_And_Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Fourth_Button"] = 8] = "Fourth_Button";
    MouseBindings[MouseBindings["Fifth_Button"] = 16] = "Fifth_Button";
})(MouseBindings || (MouseBindings = {}));
var KeyboardBindings;
(function (KeyboardBindings) {
    KeyboardBindings[KeyboardBindings["Shift"] = 16] = "Shift";
    KeyboardBindings[KeyboardBindings["Ctrl"] = 17] = "Ctrl";
    KeyboardBindings[KeyboardBindings["Alt"] = 18] = "Alt";
    KeyboardBindings[KeyboardBindings["Meta"] = 91] = "Meta";
    KeyboardBindings[KeyboardBindings["ShiftCtrl"] = 1617] = "ShiftCtrl";
    KeyboardBindings[KeyboardBindings["ShiftAlt"] = 1618] = "ShiftAlt";
    KeyboardBindings[KeyboardBindings["ShiftMeta"] = 1691] = "ShiftMeta";
    KeyboardBindings[KeyboardBindings["CtrlAlt"] = 1718] = "CtrlAlt";
    KeyboardBindings[KeyboardBindings["CtrlMeta"] = 1791] = "CtrlMeta";
    KeyboardBindings[KeyboardBindings["AltMeta"] = 1891] = "AltMeta";
})(KeyboardBindings || (KeyboardBindings = {}));
export { MouseBindings, KeyboardBindings };
//# sourceMappingURL=ToolBindings.js.map