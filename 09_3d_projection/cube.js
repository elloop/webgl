var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec4 a_color;\n' +
    'uniform mat4 u_mvpMat;\n' +
    'varying vec4 v_color;\n' +
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

    var n = initVertexBuffers(gl);
    
    // mvp
    var mvpMat = new Matrix4();
    mvpMat.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    var u_mvpMat = gl.getUniformLocation(gl.program, "u_mvpMat");
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // draw elements.
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        1  , 1  , 1  , 1 , 1 , 1 , // 0 white
        -1 , 1  , 1  , 1 , 0 , 1 , //
        -1 , -1 , 1  , 1 , 0 , 0 , // 2 red
        1  , -1 , 1  , 1 , 1 , 0 , //
        1  , -1 , -1 , 0 , 1 , 0 , // 4 green
        1  , 1  , -1 , 0 , 1 , 1 , //
        -1 , 1  , -1 , 0 , 0 , 1 , // 6 blue
        -1 , -1 , -1 , 0 , 0 , 0 , // 7 black
    ]);

    // 1. vertex and color buffer (ARRAY_BUFFER)
    var arrayBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var elemSize = vertices.BYTES_PER_ELEMENT;
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 6 * elemSize, 0);
    gl.enableVertexAttribArray(a_pos);

    var a_color = gl.getAttribLocation(gl.program, 'a_color');
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * elemSize, 3 * elemSize);
    gl.enableVertexAttribArray(a_color);


    // 2. index buffer (ELEMENT_ARRAY_BUFFER)
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        5, 7, 6, 5, 4, 7, // back
        6, 1, 0, 0, 5, 6, // up
        2, 7, 3, 7, 4, 3, // down
        2, 7, 3, 7, 4, 3, // left
        6, 7, 1, 7, 2, 1, // right
    ]);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

