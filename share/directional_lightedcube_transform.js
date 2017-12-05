var gMouseDown = false;
var gClickX    = 0;
var gClickY    = 0;
var gRot       = {x:0, y:0, z:0};
// var gRot       = {x:20, y:1, z:0};

var u_lightColor;
var u_lightDirection;
var u_mvpMat;
var u_normalMat;
var u_ambient;
var u_modelMat;
var gNumberElements = 0;

function main() {

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        alert('failed to get the rendering context for webgl');
        return;
    }

    readShaderFile(gl, "directional_transform.vert", "v");
    readShaderFile(gl, "directional.frag", "f");
}

function start(gl) {
    var canvas = document.getElementById('webgl');

    if (!initShaders(gl, vssrc, fssrc)) {
    	console.log('failed to initialize shaders');
    	return;
    }

    gNumberElements = initVertexBuffers(gl);

    u_lightColor     = gl.getUniformLocation(gl.program, "u_lightColor");
    u_lightDirection = gl.getUniformLocation(gl.program, "u_lightDirection");
    u_mvpMat         = gl.getUniformLocation(gl.program, "u_mvpMat");
    u_modelMat       = gl.getUniformLocation(gl.program, "u_modelMat");
    u_normalMat      = gl.getUniformLocation(gl.program, "u_normalMat");
    u_ambient        = gl.getUniformLocation(gl.program, "u_ambient");

    canvas.onmousedown = function(event) {
        gMouseDown = true;
        gClickX = event.clientX;
        gClickY = event.clientY;
    };

    canvas.onmousemove = function(event) {
        if (gMouseDown) {
            var factor = 100 / canvas.width;
            var dx = factor * (event.clientX - gClickX);
            var dy = factor * (event.clientY - gClickY);
            // gRot.x = Math.min(Math.max((gRot.x + dy), -90), 90);
            gRot.x = gRot.x + dy
            gRot.y = gRot.y + dx;
            draw(gl, event.target, gNumberElements);
            gClickX = event.clientX;
            gClickY = event.clientY;
        }
    };

    canvas.onmouseup = function(event) {
        gMouseDown = false;
    };

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    draw(gl, canvas, gNumberElements);
}

function draw(gl, canvas, n) {

    // light color
    gl.uniform3f(u_lightColor, 1, 1, 1.0);  // white light

    // light direction
    var lightDir = new Vector3([0.5, 3.0, 4.0]);
    lightDir.normalize();
    gl.uniform3fv(u_lightDirection, lightDir.elements);

    // model mat
    var modelMat = new Matrix4();
    modelMat.setRotate(gRot.x, 1, 0, 0);
    modelMat.rotate(gRot.y, 0, 1, 0);
    modelMat.rotate(gRot.z, 0, 0, 1);
    gl.uniformMatrix4fv(u_modelMat, false, modelMat.elements);

    // mvp
    var mvpMat = new Matrix4();
    mvpMat.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    mvpMat.multiply(modelMat);
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    // normal mat, (inverse of & transpose of modelMat)
    var normalMat = new Matrix4();
    normalMat.setInverseOf(modelMat);
    normalMat.transpose();
    gl.uniformMatrix4fv(u_normalMat, false, normalMat.elements);

    // ambient
    var ambient = new Vector3([0.2, 0.2, 0.2]);
    gl.uniform3fv(u_ambient, ambient.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        1  , 1  , 1  , -1 , 1  , 1  , -1 , -1 , 1  , 1  , -1 , 1  , // 0  , 1  , 2  , 3        front
        1  , 1  , 1  , 1  , -1 , 1  , 1  , -1 , -1 , 1  , 1  , -1 , // 4  , 5  , 6  , 7        right
        -1 , 1  , 1  , 1  , 1  , 1  , 1  , 1  , -1 , -1 , 1  , -1 , // 8  , 9  , 10 , 11       up
        1  , 1  , -1 , 1  , -1 , -1 , -1 , -1 , -1 , -1 , 1  , -1 , // 12 , 13 , 14 , 15       back
        -1 , 1  , -1 , -1 , -1 , -1 , -1 , -1 , 1  , -1 , 1  , 1  , // 16 , 17 , 18 , 19       left
        -1 , -1 , 1  , -1 , -1 , -1 , 1  , -1 , -1 , 1  , -1 , 1  , // 20 , 21 , 22 , 23       down
    ]);

    var normals = new Float32Array([
        0  , 0  , 1  , 0  , 0  , 1  , 0  , 0  , 1  , 0  , 0  , 1  , // front
        1  , 0  , 0  , 1  , 0  , 0  , 1  , 0  , 0  , 1  , 0  , 0  , // right
        0  , 1  , 0  , 0  , 1  , 0  , 0  , 1  , 0  , 0  , 1  , 0  , // up
        0  , 0  , -1 , 0  , 0  , -1 , 0  , 0  , -1 , 0  , 0  , -1 , // back
        -1 , 0  , 0  , -1 , 0  , 0  , -1 , 0  , 0  , -1 , 0  , 0  , // left
        0  , -1 , 0  , 0  , -1 , 0  , 0  , -1 , 0  , 0  , -1 , 0  , // down
    ]);


    var colors = new Float32Array([
        //  red cube.
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // front
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // right
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // up
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // back
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // left
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // down
    ]);

    // 1. vertex, normal and color buffer (ARRAY_BUFFER)
    var elemSize = vertices.BYTES_PER_ELEMENT;
    initArrayBuffer(gl, vertices, "a_pos", elemSize);
    initArrayBuffer(gl, normals, "a_normal", elemSize);
    initArrayBuffer(gl, colors, "a_color", elemSize);


    // 2. index buffer (ELEMENT_ARRAY_BUFFER)
    var indices = new Uint8Array([
        0  , 1  , 2  , 0  , 2  , 3  , // front
        4  , 5  , 6  , 4  , 6  , 7  , // right
        8  , 9  , 10 , 8  , 10 , 11 , // up
        12 , 13 , 14 , 12 , 14 , 15 , // back
        16 , 17 , 18 , 16 , 18 , 19 , // left
        20 , 21 , 22 , 20 , 22 , 23 , // down
    ]);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, buf, attrib, elemSize) {
    var arrayBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuf);
    gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);

    var attribute = gl.getAttribLocation(gl.program, attrib);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 3 * elemSize, 0);
    gl.enableVertexAttribArray(attribute);
}

