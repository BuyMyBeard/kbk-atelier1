document.addEventListener("DOMContentLoaded", () => init_UI());

const svgns = "http://www.w3.org/2000/svg";
const viewPortMaxUnitX = 1000;
const viewPortMaxUnitY = 1000;



let viewport;

const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const sales = [6500, 5550, 4200, 4525, 2500, 1500, 500, 1000, 1750, 2300, 3700, 3500];

function insertViewPort(containerId) {
    viewport = document.createElementNS(svgns, "svg");
    viewport.setAttribute("id", "viewport");
    viewport.setAttribute("viewBox", "0 0 " + viewPortMaxUnitX + " " + viewPortMaxUnitY);
    document.getElementById(containerId).appendChild(viewport);
}

function init_UI() {
    insertViewPort("graphContainer");
    const options = {
        title: "Ventes 2023",
    }
    const graph = new Graph({x: months, y: sales}, {x: viewPortMaxUnitX, y: viewPortMaxUnitY}, options);
    console.log(graph);
    graph.draw(viewport);
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
function text(x, y, content, angle = 0, size = "1", fill = "black", anchor = "left", fontWeight = "normal", dy = "0.5em") {
    let text = document.createElementNS(svgns, "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.setAttribute("transform", `rotate(${angle},${x},${y})`);
    text.setAttribute("font-size", size + "em");
    text.setAttribute("fill", fill);
    text.setAttribute("text-anchor", anchor);
    text.setAttribute("font-weight", fontWeight);
    text.setAttribute("dy", dy);
    text.innerHTML = content;
    return text;
}

class Graph {
    margins = {
        top: 150,
        bottom: 100,
        left: 200,
        right: 20,
    };

    max = 7000;
    grid = {
        y: {
            major: {
                separation: 1000,
                color: 'grey',
                width: 2,
            },
            minor: {       
                separation: 100,
                color: 'grey',
                width: .5,
            }
        },
    };
    spacing = 10;
    sidePadding = 20;
    title = "Title";
    textColor = "black";
    dataYOffset = 15;
    dataFontSize = 1.1;
    labels = {
        x : {
            xOffset: 0,
            yOffset: 20,
            fontSize: 1.5,
            rotation: 45,
        },
        y : {
            xOffset: 20,
            yOffset: 5,
            fontSize: 1.5,
            rotation: 0,
        },
    }

    constructor(data, viewportSize, options) {
        this.data = data;
        this.viewportSize = viewportSize;
        Object.assign(this, options);
    }

    draw(viewport) {
        this.drawGridLines(viewport, this.grid.y.minor);
        this.drawGridLines(viewport, this.grid.y.major, true);
        this.drawTitle(viewport);
        this.drawData(viewport);
    }

    drawGridLines(viewport, grid, includeLabels = false) {
        const startX = this.margins.left;
        const endX = this.viewportSize.x - this.margins.right;
        const startY = this.viewportSize.y - this.margins.bottom;
        const endY = this.margins.top;
        let increment = (endY - startY) / (this.max / grid.separation);
        for(let y = startY; y >= endY; y += increment) {
            viewport.appendChild(line(startX, y, endX, y, grid.color, grid.width));
            if (!includeLabels) continue;
            const progress = ((y - startY) / (endY - startY)) * this.max;

            viewport.appendChild(
                text(
                    startX - this.labels.y.xOffset, 
                    y - this.labels.y.yOffset, 
                    "$ " + Math.round(progress), 
                    this.labels.y.rotation, 
                    this.labels.y.fontSize, 
                    "black", 
                    "end"));
        }
    }
    drawTitle(viewport) {
        const x = .5 * (viewPortMaxUnitX - this.margins.right - this.margins.left) + this.margins.left;
        const y = .5 * this.margins.top;

        viewport.appendChild(text(x, y, this.title, 0, 4, this.textColor, "middle", "bold"));
    }

    barColor(value) {
        if (value > 4500) {
            return "green";
        } else if (value > 3000) {
            return "yellow";
        } else if (value > 1000) {
            return "orange";
        } else {
            return "red";
        }
    }

    drawData(viewport) {
        const dataCount = this.data.x.length;
        const available = this.viewportSize.x - (2 * this.sidePadding + (dataCount - 1) * this.spacing + this.margins.left + this.margins.right);
        const startX = this.margins.left + this.sidePadding;
        const barWidth = available / dataCount;
        const heightScaling = (this.viewportSize.y - this.margins.bottom - this.margins.top) / this.max;

        for (let i = 0; i < dataCount; i++) {
            const x = startX + i * (barWidth + this.spacing);
            const y = this.viewportSize.y - this.margins.bottom;
            const barHeight = heightScaling * this.data.y[i];
            const color = this.barColor(this.data.y[i]);

            viewport.appendChild(rect(x , y - barHeight, barWidth, barHeight, color, "black", 1));
            const halfway = x + .5 * barWidth;

            viewport.appendChild(text(halfway + this.labels.x.xOffset, y + this.labels.x.yOffset, this.data.x[i], this.labels.x.rotation, this.labels.x.fontSize, "black"));
            viewport.appendChild(text(halfway, y - barHeight - this.dataYOffset, "$" + this.data.y[i], 0, this.dataFontSize, this.textColor, "middle"));
        }
    }
}
