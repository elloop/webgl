var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec2 a_tex_coord;\n' +
    'varying vec2 v_tex_coord;\n' +
    'void main() {\n' +
    '  gl_Position = a_pos;\n' +
    '  v_tex_coord = a_tex_coord; \n' +
    '}\n';

var fssrc = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_sampler;\n' +
    'varying vec2 v_tex_coord;\n' +
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_sampler, v_tex_coord);\n' +
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
        -0.5, 0.5, 0, 1.0,
        -0.5, -0.5, 0, 0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0,
    ]);

    var n = 4;

    // 2. bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 3. buffer data
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var elemSize = vertices.BYTES_PER_ELEMENT;

    // 4. vertex attribute
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 4 * elemSize, 0);

    var a_tex_coord = gl.getAttribLocation(gl.program, 'a_tex_coord');
    gl.vertexAttribPointer(a_tex_coord, 2, gl.FLOAT, false, 4 * elemSize, 2 * elemSize);

    // 5. enable vertex
    gl.enableVertexAttribArray(a_pos);
    gl.enableVertexAttribArray(a_tex_coord);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initTextures(gl, n);
}

function initTextures(gl, n) {
    var texture = gl.createTexture();

    var u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');

    var image = new Image();
    image.onload = function() {
        console.log("image load success")
        loadTexture(gl, n, texture, u_sampler, image);
    };

    image.src = '../resources/sky.jpg';
}

function loadTexture(gl, n, texture, u_sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

