let scaleX = 1;
let scaleY = 1;

let globalx = 0;
let globaly = 0;

const cellWidth = 5;
const cellHeight = 5;

/**
 * y = m * x + t - returns a generator and yields y
 *
 * @param {*} m
 * @param {*} t
 * @return {*} 
 */
function linear(m, t) {
    return function* (i, offset = 0) {
        for (let x = offset; x < i; x++) {
            yield m * x + t;
        }
    }
}

function log(x_) {
    return function* (i, offset = 0) {
        for (let x = offset; x < i; x++) {
            //yield m * x + t;
            yield Math.log(x);
        }
    }
}

function sine(t, ts = 0) {
    return function* (i, offset = 0) {
        for (let x = offset; x < i + 1; x++) {
            yield Math.sin((x + ts)) + t;
        }
    }
}

//loop through variables

const WIDTH = 8;
const HEIGHT = 8;
function drawShape(ctx, shape) {
    let x = 0;


    let middleX = ctx.canvas.width / 2;
    let middleY = ctx.canvas.height / 2;
    let gshape = shape(40);

    ctx.beginPath();
    //ctx.moveTo(x * scaleX, gshape.next().value * scaleY);
    for (const y of gshape) {
        ctx.lineTo(middleX + (x * scaleX * cellWidth), middleY + (y * scaleY * cellHeight));
        x++;
    }

    if (gshape.next().done) {
        ctx.stroke();
        ctx.closePath();
    }
}

function canvasClear(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getChosenStyle() {
    let elem = document.querySelector("input[name='style']:checked");
    return elem.value;
}

window.onload = function () {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");

    let lastTs = 0;

    function draw(ts) {
        //instanciate generator
        let path = (() => {

            switch (getChosenStyle()) {
                case "linear":
                    return linear(0.25, 4);

                case "sine":
                    return sine(4, ts);

                case "log":
                    return log(4);

                case "file":
                    return fromFile()
            }
        })();

        canvasClear(ctx);
        drawGrid(ctx);
        drawShape(ctx, path, ts);
        requestAnimationFrame(draw);
        lastTs = ts;

    }
    requestAnimationFrame(draw);
}

function zoomXHandler(event) {
    scaleX = event.target.value / 10;
}

function zoomYHandler(event) {
    console.log(event);
    scaleY = event.target.value / 10;
}

function setXHandler(event) {
    console.log(event);
}

function setYHandler(event) {
    console.log(event);
}

function drawGrid(ctx) {
    //debugger;
    let cellWidthFull = cellWidth * scaleX;
    let cellHeightFull = cellHeight * scaleY;

    let cellCountX = ctx.canvas.width / cellWidthFull;
    let cellCountY = ctx.canvas.height / cellHeightFull;

    let middleX = ctx.canvas.width / 2;
    let middleY = ctx.canvas.height / 2;

    for (let x = 0; x < cellCountX; x++) {
        for (let y = 0; y < cellCountY; y++) {
            ctx.beginPath();
            ctx.strokeStyle = "grey";
            ctx.rect(x * cellWidth * scaleX,y * cellHeight * scaleY, cellWidthFull, cellHeightFull);
            ctx.stroke();
        }
    }
}