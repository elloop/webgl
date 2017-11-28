var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec4 a_color;\n' +
    'varying vec4 v_color;\n' +
    'uniform mat4 u_projetMat;\n' +
    'void main() {\n' +
    '  gl_Position = u_projetMat * a_pos;\n' +
    '  v_color = a_color;\n' +
    '}\n';

var fssrc = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_color;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('failed to get the rendering context for webgl');
        return;
    }

    if (!initShaders(gl, vssrc, fssrc)) {
    	console.log('failed to initialize shaders');
    	return;
    }

    // 1. create buffer
    var buffer = gl.createBuffer();

    var vertices = new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1, 1, 0.4,
        0, -0.6, -0.2, 1.0, 1, 0.4,

        0.0, 0.5, 0, 0.4, 0.4, 1,
        -0.5, -0.5, 0, 0.4, 0.4, 1,
        0.5, -0.5, 0, 1.0, 0.4, 0.4,
    ]);

    var n = 9;

    // 2. bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 3. buffer data
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var elemSize = vertices.BYTES_PER_ELEMENT;

    // 4. vertex attribute
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 6 * elemSize, 0);

    var a_color = gl.getAttribLocation(gl.program, 'a_color');
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * elemSize, 3 * elemSize);

    // 5. enable vertex
    gl.enableVertexAttribArray(a_pos);
    gl.enableVertexAttribArray(a_color);

    // view matrix.
    var projectMat = new Matrix4();
    var u_projetMat = gl.getUniformLocation(gl.program, "u_projetMat");

    document.onkeydown = function(event) {
        keydown(event, gl, n, projectMat, u_projetMat);
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    draw(gl, n, projectMat, u_projetMat);
}

var gNear = 0, gFar = 1;
function keydown(event, gl, n, projectMat, u_projetMat) {
    console.log("event.keycode: ", event.keyCode)
    switch(event.code) {
        case "ArrowLeft":
            gNear -= 0.01;
            console.log("event.keycode near--: ", event.code)
            break;
        case "ArrowRight":
            gNear += 0.01;
            console.log("event.keycode near++: ", event.code)
            break;
        case "ArrowUp":
            console.log("event.keycode far++: ", event.code)
            gFar += 0.01;
            break;
        case "ArrowDown":
            gFar -= 0.01;
            console.log("event.keycode far--: ", event.code)
            break;
        default: return;
    }
    draw(gl, n, projectMat, u_projetMat);
}

function draw(gl, n, projectMat, u_projetMat) {
    projectMat.setOrtho(-1, 1, -1, 1, gNear, gFar);
    gl.uniformMatrix4fv(u_projetMat, false, projectMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var nearFarDesc = document.getElementById("nearFar");
    nearFarDesc.innerHTML = "near: " + Math.round(gNear * 100) / 100 + ", far: " + Math.round(gFar * 100) / 100;
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
