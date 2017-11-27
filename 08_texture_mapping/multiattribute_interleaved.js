var vssrc = 
'attribute vec4 a_pos;\n' +
'attribute float a_point_size;\n' +
'void main() {\n' +
'  gl_Position = a_pos;\n' +
'  gl_PointSize = a_point_size; \n' +
'}\n'

var fssrc = 
'void main() {\n' +
'  gl_FragColor = vec4(1.0, 0, 0, 1);\n' +
'}\n'

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
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0,
    ]);

    var n = 3;

    // 2. bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 3. buffer data
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var elemSize = vertices.BYTES_PER_ELEMENT;
    // 4. vertex attribute
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 3 * elemSize, 0);

    var a_point_size = gl.getAttribLocation(gl.program, "a_point_size");
    gl.vertexAttribPointer(a_point_size, 1, gl.FLOAT, false, 3 * elemSize, 2 * elemSize);

    // 5. enable vertex
    gl.enableVertexAttribArray(a_pos);
    gl.enableVertexAttribArray(a_point_size)

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINT, 0, n);
}

