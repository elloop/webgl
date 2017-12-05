var vssrc = null;
var fssrc = null;

function main() {

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        alert('failed to get the rendering context for webgl');
        return;
    }

    readShaderFile(gl, "color_cube.vert", "v");
    readShaderFile(gl, "color_cube.frag", "f");
}

function start(gl) {
    var canvas = document.getElementById('webgl');

    if (!initShaders(gl, vssrc, fssrc)) {
    	console.log('failed to initialize shaders');
    	return;
    }

    var u_mvpMat = gl.getUniformLocation(gl.program, "u_mvpMat");

    var n = initVertexBuffers(gl);
    
    // mvp
    var mvpMat = new Matrix4();
    mvpMat.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // draw elements.
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

    var colors = new Float32Array([
        // red cube.
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // front
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // right
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // up
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // back
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // left
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // down
    ]);

    // 1. vertex and color buffer (ARRAY_BUFFER)
    var arrayBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var elemSize = vertices.BYTES_PER_ELEMENT;
    initArrayBuffer(gl, vertices, "a_pos", elemSize);
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

function readShaderFile(gl, fileName, shader) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status !== 404) { 
	    onReadShader(gl, request.responseText, shader); 
    }
  }

  request.open('GET', fileName, true); 
  request.send();                     
}

function onReadShader(gl, content, shader) {
  if (shader == 'v') {
    vssrc = content;
  } 
  else if (shader == 'f') { 
    fssrc = content;
  }

  if (vssrc && fssrc) {
      start(gl);
  }
}

