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

// DrawRectangle.js
class Shape {
    constructor(vertex_array, color_array, shape) {
        this.shape = shape;
        this.vertex_array = new Float32Array(vertex_array);
        this.color_array = color_array;
    }
}
let pink = [0.8, 0.2, 0.5];
let yellow = [0.8, 0.7, 0.2];
let green = [0.2, 1.0, 0.2];
let black = [0.0, 0.0, 0.0];
let white = [0.9, 1.0, 1.0]

let gl;
let flower_shapes = [
    // petal 1
    new Shape([-0.4, 0.6, -0.3, 0.8, -0.1, 0.8, 0.2, 0.6, 0.1, 0.3, -0.1, 0.3], pink, "Circles"),
    new Shape([-0.1, 0.3, 0.1, 0.3, 0.0, 0.0], yellow, "Triangles"),
    new Shape([0.0, 0.0, -0.1, 0.3, -0.2, 0.4], pink, "Triangles"),

    // petal 2
    new Shape([0.4, 0.5, 0.8, 0.4, 0.8, 0.1,0.5, 0.0, 0.2, 0.0, 0.1, 0.3], pink, "Circles"),
    new Shape([0.0, 0.0, 0.1, 0.3, 0.2, 0.0], yellow, "Triangles"),
    
    // petal 3
    new Shape([0.5, 0.0, 0.8, -0.1, 0.9, -0.4, 0.6, -0.5, 0.1, -0.2, 0.2, 0.0], pink, "Circles"),
    new Shape([0.0, 0.0, 0.2, 0.0, 0.1, -0.2], yellow, "Squares"),

    // petal 4
    new Shape([0.1, -0.2, 0.0, -0.4, -0.3, -0.6, -0.5, -0.6, -0.6, -0.4, -0.3, -0.1, 0.0, 0.0], pink, "Circles"),
    // petal 5
    new Shape([-0.1, 0.3, 0.0, 0.0, -0.3, -0.1, -0.5, -0.1, -0.7, 0.2, -0.5, 0.4, -0.2, 0.4], pink, "Circles"),
    //new Shape([0.0, -0.2, 0.0, -1.0, 0.0, -0.4], green, "Triangles"),
    //stem
    new Shape([0.1, -0.2, 0.0, -1.0, 0.0, -0.4], green, "Triangles"),
    new Shape([-0.6, -0.7, -0.3, -0.7, -0.3, -0.9, 0.0, -0.8], green, "Squares"),
    // bee
    new Shape([0.6, 0.6, 0.6, 0.8, 0.7, 0.6, 0.7, 0.6, 0.7, 0.8, 0.8, 0.6, 0.8, 0.6, 0.8, 0.8, 0.9, 0.6], yellow, "Triangles"),
    new Shape([0.7, 0.6, 0.6, 0.8, 0.7, 0.8], black, "Triangles"),
    new Shape([0.8, 0.6, 0.7, 0.8, 0.8, 0.8], black, "Triangles"),
    new Shape([0.9, 0.6, 0.8, 0.8, 0.9, 0.8], black, "Triangles"),

    new Shape([0.8, 0.9, 0.7, 0.8, 0.7, 0.9, 0.8, 1.0, 0.9, 1.0], white, "Circles"),
];

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

    gl.clearColor(0.5, 0.6, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // compile and send to GPU

    if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)) {
        console.log("Failed to load and compile shaders.");
        return -1;
    }

    drawShapes(flower_shapes);
}

function clearGL() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl_shapes = [];
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