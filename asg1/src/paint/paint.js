let VERTEX_SHADER = `
    precision mediump float;

    attribute vec2 a_Position;
    
    void main() {
        // return is setting this variable (must be a vec4)
        gl_Position = vec4(a_Position, 1.0, 1.0);
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
let gl_shapes = [];
let gl;

let shape = "Squares";
// updated on click
let x_click = 0;
let y_click = 0;

let shapes = [];

let is_clicked = false;

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
    canvas.onmousemove = function(ev) { handle_drag(ev); };
    canvas.onmouseup = function(ev) {handle_unclick(ev); };
}

function clearGL() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl_shapes = [];
}

function handle_click(click_event) {
    is_clicked = true;
    x_click = (click_event.clientX - 210.0) / 200.0;
    y_click = -1 * (click_event.clientY - 210.0) / 200.0;
    //clearGL();

    console.log(`${x_click}, ${y_click}`);
    if (-1 <= x_click && x_click <= 1 && -1 <= y_click  && y_click <= 1){
        gl_shapes.push(makeShape(shape, x_click, y_click));
        drawShapes(gl_shapes);
    }
}

function handle_drag(click_event) {
    if(is_clicked) {
        x_click = (click_event.clientX - 210.0) / 200.0;
        y_click = -1 * (click_event.clientY - 210.0) / 200.0;
        //clearGL();

        console.log(`${x_click}, ${y_click}`);
        if (-1 <= x_click && x_click <= 1 && -1 <= y_click  && y_click <= 1){
            gl_shapes.push(makeShape(shape, x_click, y_click));
            drawShapes(gl_shapes);
        }
    }
}

function handle_unclick(click_event) {
    is_clicked = false;
}

function set_shape(new_shape) {
    console.log(`Shape: ${new_shape}`);
    shape = new_shape;
}

function drawMesh(vertex_array, color_array, mode) {
    console.log("Drawing triangle");
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

    gl.drawArrays(mode, 0, vertex_array.length / 2);
}

function drawShapes(shapes) {
    console.log(`Drawing ${shape}`);
    let size = document.getElementById("size_slider").value;
    for (const shape of shapes) {
        if (shape.shape === "Squares") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLE_STRIP);
        }
        if (shape.shape === "Triangles") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLES);
        }
        if (shape.shape == "Circles") {
            drawMesh(shape.vertex_array, shape.color_array, gl.TRIANGLE_FAN);
        }
    }
}

function getColor() {
    red = document.getElementById("red_slider").value / 100.0;
    green = document.getElementById("green_slider").value / 100.0;
    blue = document.getElementById("blue_slider").value / 100.0;

    return [red, green, blue];
}

function makeShape(shape, x, y) {
    let color_array = getColor();
    let size = document.getElementById("size_slider").value / 100.0;
    let vertex_array;
    // fixme
    if (shape === "Squares") {
        vertex_array = [x - size, y + size,
                        x - size, y - size,
                        x + size, y + size,
                        x + size, y - size];
    }

    if (shape === "Triangles") {
        vertex_array = [x - size, y - size,
                        x + size, y - size,
                        x, y + size];
    }

    if (shape === "Circles") {
        let n_segments = document.getElementById("seg_slider").value;
        let theta = (2 * Math.PI) / n_segments;
        vertex_array = [x, y];
        for (let i=0; i<=n_segments; i++) {
            let x_i = x + Math.cos(theta * i) * size;
            let y_i = y + Math.sin(theta * i) * size;
            vertex_array.push(x_i);
            vertex_array.push(y_i);
        }
    }
    return new Shape(new Float32Array(vertex_array), color_array, shape);
}