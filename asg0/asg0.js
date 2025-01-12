// DrawRectangle.js

var ctx;

function main() {
    // Retrieve <canvas> element 4 
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);
    // Draw a blue rectangle 
    let v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, "red");
    let v2 = new Vector3([1, 0, 0]);
    drawVector(v2, "blue");
}

function drawVector(v, color) {
    ctx.strokeStyle = color;
    // mult coords by 20??
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200 + v.elements[0] * 20, 200 + v.elements[1] * 20);
    ctx.stroke();

}

function angleBetween(va, vb) {
    let angle_between = Math.acos(Vector3.dot(va.normalize(), vb.normalize())) * 180 / Math.PI;
    return angle_between;
}

function areaTriangle(va, vb) {
    let area_triangle = Vector3.cross(va, vb).magnitude() / 2;
    return area_triangle;
}

function handleDrawEvent(vec) {
    let v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, "red");
    let v2 = new Vector3([1, 0, 0]);
    let v3 = new Vector3([0,0,0]);
    let v4 = new Vector3([0,0,0]);

    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
    // get text boxes
    let x_coord = document.getElementById('x_coord_1').value;
    let y_coord = document.getElementById('y_coord_1').value;

    v1.elements[0] = x_coord;
    v1.elements[1] = y_coord;
    drawVector(v1, "red");

    // get text boxes
    x_coord = document.getElementById('x_coord_2').value;
    y_coord = document.getElementById('y_coord_2').value;

    v2.elements[0] = x_coord;
    v2.elements[1] = y_coord;
    drawVector(v2, "blue");

    operation = document.getElementById('operation').value;
    scalar = document.getElementById('scalar').value;
    switch(operation){
        case "add":
            v3.set(v1.add(v2));
            break;
        case "sub":
            v3.set(v1.sub(v2));
            break;
        case "mul":
            v3.set(v1.mul(scalar));
            v4.set(v2.mul(scalar));
            break;
        case "div":
            v3.set(v1.div(scalar));
            v4.set(v2.div(scalar));
            break;
        case "mag":
            console.log(`Magnitude v1: ${v1.magnitude()}`);
            console.log(`Magnitude v2: ${v2.magnitude()}`);
            break;
        case "norm":
            v3.set(v1.normalize());
            v4.set(v2.normalize());
            break;
        case "angle":
            console.log(`Angle: ${angleBetween(v1, v2)}`);
            break;
        case "area":
            console.log(`Area: ${areaTriangle(v1, v2)}`);
            break;
    }
    drawVector(v3, "green");
    drawVector(v4, "green");
}