document.addEventListener("DOMContentLoaded", () => init_UI());

function insertViewPort(containerId) {
    viewport = document.createElementNS(svgns, "svg");
    viewport.setAttribute("id", "viewport");
    viewport.setAttribute("viewBox", "0 0 " + viewPortMaxUnitX + " " + viewPortMaxUnitY);
    document.getElementById(containerId).appendChild(viewport);
}

function init_UI() {
    insertViewPort("graphContainer");
    render
}

function insertViewPort(containerId) {
    viewport = document.createElementNS(svgns, "svg");
    viewport.setAttribute("id", "viewport");
    viewport.setAttribute("viewBox", "0 0 " + viewPortMaxUnitX + " " + viewPortMaxUnitY);
    document.getElementById(containerId).appendChild(viewport);
}
function demoShapes() {
    viewport.appendChild(line(20, 20, 400, 200, 'green', 15))
    viewport.appendChild(line(20, 20, 400, 150, 'red', 15))
    viewport.appendChild(line(20, 20, 400, 100, 'blue', 15))
    viewport.appendChild(line(20, 20, 400, 50, 'orange', 15))
    viewport.appendChild(rect(500, 20, 300, 200, 'orange', 'yellow', 15))
    viewport.appendChild(rect(500, 300, 300, 200, 'magenta', 'cyan', 15))
    let gray;
    for (let angle = 360; angle >= 0; angle -= 15) {
        gray = angle / 360 * 255;
        viewport.appendChild(text(220, 400, 'Bonjour', angle, 4, `rgb(${gray}, ${gray}, ${gray})`))
    }
}
function line(x1, y1, x2, y2, stroke = "black", strokeWidth = 1) {
    let line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);  line.setAttribute("y2", y2);
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", strokeWidth);
    return line;
}
function rect(x, y, width, height, fill = "white", stroke = "black", strokeWidth = 1) {
    let rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", x); rect.setAttribute("y", y);
    rect.setAttribute("width", width); rect.setAttribute("height", height);
    rect.setAttribute("fill", fill); rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", strokeWidth);
    return rect;
}
function text(x, y, content, angle = 0, size = "1", fill = "black") {
    let text = document.createElementNS(svgns, "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.setAttribute("transform", `rotate(${angle},${x},${y})`);
    text.setAttribute("font-size", size + "em");
    text.setAttribute("fill", fill);
    text.innerHTML = content;
    return text;
}