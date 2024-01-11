export default function (a, b) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.id === b.id;
}
//# sourceMappingURL=lutMatches.js.map