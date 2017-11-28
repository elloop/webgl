var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec4 a_color;\n' +
    'varying vec4 v_color;\n' +
    'uniform mat4 u_mvpMat;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMat * a_pos;\n' +
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
        // zorder 1
        0, 1, -4, 0.4, 1, 0.4,
        -0.5, -1, -4, 0.4, 1, 0.4,
        0.5, -1, -4, 1.0, 0.4, 0.4,

        // zorder 2
        0, 1, -2, 1, 1, 0.4,
        -0.5, -1, -2, 1, 1, 0.4,
        0.5, -1, -2, 1.0, 0.4, 0.4,

        // zorder 3
        0, 1, 0, 0.4, 0.4, 1,
        -0.5, -1, 0, 0.4, 0.4, 1,
        0.5, -1, 0, 1.0, 0.4, 0.4,
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

    // model mat
    var modelMat = new Matrix4();
    modelMat.setTranslate(0.75, 0, 0);

    // view matrix.
    var viewMat = new Matrix4();
    viewMat.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);

    // projection mat
    var projectMat = new Matrix4();
    projectMat.setPerspective(30, canvas.width / canvas.height, 1, 100);

    var mvpMat = new Matrix4();
    mvpMat.set(projectMat).multiply(viewMat).multiply(modelMat);

    var u_mvpMat = gl.getUniformLocation(gl.program, "u_mvpMat");
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    modelMat.setTranslate(-0.75, 0, 0);
    mvpMat.set(projectMat).multiply(viewMat).multiply(modelMat);
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

