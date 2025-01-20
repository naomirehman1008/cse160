let VERTEX_SHADER = `
    precision mediump float;

    attribute vec2 a_Position;
    uniform vec2 u_Transform;
    
    void main() {
        // return is setting this variable (must be a vec4)
        gl_Position = vec4((a_Position + u_Transform), 1.0, 1.0);
    }
`;

let FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec3 u_Color;

    void main() {

        gl_FragColor = vec4(u_Color, 1.0);
    }
`;


class Shape {
    constructor(vertex_array, color_array, shape) {
        this.shape = shape;
        this.vertex_array = vertex_array;
        this.color_array = color_array;
    }
}

let gl;

let x_click = 0;
let y_click = 0;

//let gl_shapes = [new Shape(new Float32Array([-0.1, 0.3, 0.1, 0.3, 0.0, 0.0]), [1.0, 0.0, 0.0], "Triangles")];

let diamond = [
    new Shape(new Float32Array([0.0, 0.09, 0.03, 0.12, 0.06, 0.09, 0.09, 0.12, 0.12, 0.09, 0.15, 0.12, 0.18, 0.09]), [0.8, 1.0, 1.0], "Squares"),
    new Shape(new Float32Array([0.0, 0.09, 0.09, 0.0, 0.18, 0.09]), [0.8, 1.0, 1.0], "Triangles"),
];

let quartz = [
    new Shape(new Float32Array([0.0, 0.09, 0.06, 0.0, 0.12, 0.09, 0.18, 0.0]), [1.0, 1.0, 0.9], "Squares"),
]

let score = 0;
let time = 120;

let timerVar;
let nextFrameVar;

// none, diamond, or quartz
let curDisp = 'none';
let rand_x = 0;
let rand_y = 0;
let game_in_play = false;

function main() {
    console.log("asg1");
    let canvas = document.getElementById("webgl");
    if(!canvas){
        console.log("Failed to get canvas.");
        return -1;
    }
    gl = getWebGLContext(canvas);
    if(!gl) {
        console.log("Failed to get WebGL context.");
        return -1;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // compile and send to GPU

    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to load and compile shaders.");
        return -1;
    }

    canvas.onmousedown = function(ev) { handle_click(ev); };
}

function clearGL() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function handle_click(click_event) {

    if (!game_in_play){
        return;
    }
    x_click = (click_event.clientX - 210.0) / 200.0;
    y_click = -1 * (click_event.clientY - 210.0) / 200.0;
    //clearGL();

    console.log(`${x_click}, ${y_click}`);
    if (curDisp === 'none') {
        score -= 5;
    }
    //FIXME
    if ((Math.abs(rand_x - x_click) < 0.1 && (Math.abs(rand_x - x_click) < 0.1))){
        if (curDisp === 'quartz') {
            score -= 20;
        }
        if (curDisp === 'diamond') {
            score += 10;
        }
    }
    const score_out = document.getElementById("score");
    score_out.textContent = `Score: ${score}$`;
}

function drawMesh(vertex_array, color_array, mode, transform) {
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Can't create buffer");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    //send triangle to gpu
    gl.bufferData(gl.ARRAY_BUFFER, vertex_array, gl.STATIC_DRAW);

    let u_Color = gl.getUniformLocation(gl.program, "u_Color");
    gl.uniform3f(u_Color, color_array[0], color_array[1], color_array[2]);

    let u_Transform = gl.getUniformLocation(gl.program, "u_Transform");
    gl.uniform2f(u_Transform, transform[0], transform[1]);

    gl.drawArrays(mode, 0, vertex_array.length / 2);
}

function drawShapes(shapes, x, y) {
    for (const shape of shapes) {
        if (shape.shape === "Squares") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLE_STRIP, [x, y]);
        }
        if (shape.shape === "Triangles") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLES, [x, y]);
        }
        if (shape.shape == "Circles") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLE_FAN, [x, y]);
        }
    }
}

function showShape(shape) {
    if (shape == "diamond") {
        drawShapes(diamond, 0, 0);
    }
    if (shape == "quartz") {
       drawShapes(quartz, 0, 0);
    }
}

function startGame() {
    score = 0;
    time = 120;
    game_in_play = true;
    const score_out = document.getElementById("score");
    score_out.textContent = `Score: ${score}$`;
    const time_out = document.getElementById("time");
    time_out.textContent = `Time Remaining: ${time}`;
    timerVar = setInterval(updateTime, 1000);
    updateScreen();
}

function updateTime() {
    time -= 1;
    const time_out = document.getElementById("time");
    time_out.textContent = `Time Remaining: ${time}`;
    if (time < 0) {
        finishGame();
    }
}

function finishGame() {
    game_in_play = false;
    clearInterval(timerVar);
    clearTimeout(nextFrameVar);
}

function updateScreen() {
    rand_x = (Math.random() * 1.9) - 1.0;
    rand_y = (Math.random() * 1.9) - 1.0;
    rand_shape = (Math.random() > 0.5) ? diamond : quartz;
    drawShapes(rand_shape, rand_x, rand_y);
    console.log("setting timeout");
    curDisp = (rand_shape == diamond) ? "diamond" : "quartz";
    nextFrameVar = setTimeout(clearScreen, Math.floor(Math.random()*1000) + 200);
}

function clearScreen() {
    clearGL();
    curDisp = "none";
    nextFrameVar = setTimeout(updateScreen, Math.floor(Math.random()*3000) + 2000);
}