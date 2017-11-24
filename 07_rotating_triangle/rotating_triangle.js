var vssrc = 
'attribute vec4 a_pos;\n' +
'uniform mat4 u_model_mat;\n' +
'void main() {\n' +
'  gl_Position = u_model_mat * a_pos;\n' +
'}\n'

var fssrc = 
'void main() {\n' +
'  gl_FragColor = vec4(1.0, 0, 0, 1);\n' +
'}\n'

var ROT_PER_SEC = 60.0;

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
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    var n = 3;

    // 2. bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 3. buffer data
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 4. vertex attribute
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

    // 5. enable vertex
    gl.enableVertexAttribArray(a_pos);

    var currentAngle = 0.0;

    var uModelMat = new Matrix4();

    var u_model_mat = gl.getUniformLocation(gl.program, "u_model_mat");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, uModelMat, u_model_mat);
        requestAnimationFrame(tick);
    };

    tick();
}

function draw(gl, n, angle, uMat, u_mat) {
    uMat.setRotate(angle, 0, 0, 1);
    gl.uniformMatrix4fv(u_mat, false, uMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

var gLast = Date.now();
function animate(al) {
    var now = Date.now();
    var elapsed = now - gLast;
    gLast = now;
    var newAl = al + (ROT_PER_SEC * elapsed) / 1000.0;
    return newAl % 360;
}
