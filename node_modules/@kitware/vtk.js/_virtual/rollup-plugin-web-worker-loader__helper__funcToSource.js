function funcToSource(fn, sourcemapArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var regex = /(['"])__worker_loader_strict__(['"])/g;
    var lines = [];

    // instead of extracting the function source code, just return the function as if it's being evaluated
    // by the caller.
    var source = fn.toString();
    source = source.replace(regex, '$1use strict$2');
    lines.push('(' + source + ')()');

    if (sourcemap) {
        lines.push('\/\/# sourceMappingURL=' + sourcemap + '\n');
    }
    return lines;
}

export { funcToSource as f };
