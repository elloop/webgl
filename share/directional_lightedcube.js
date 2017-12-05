var vssrc = null;
var fssrc = null;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        alert('failed to get the rendering context for webgl');
        return;
    }

    readShaderFile(gl, "directional.vert", "v");
    readShaderFile(gl, "directional.frag", "f");
}

function start(gl) {
    var canvas = document.getElementById('webgl');

    if (!initShaders(gl, vssrc, fssrc)) {
    	console.log('failed to initialize shaders');
    	return;
    }

    var n = initVertexBuffers(gl);

    var u_mvpMat         = gl.getUniformLocation(gl.program, "u_mvpMat");
    var u_lightColor     = gl.getUniformLocation(gl.program, "u_lightColor");
    var u_lightDirection = gl.getUniformLocation(gl.program, "u_lightDirection");

    // mvp
    var mvpMat = new Matrix4();
    mvpMat.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);

    // light color
    gl.uniform3f(u_lightColor, 1.0, 1.0, 3.0);  // white light

    // light direction
    var lightDir = new Vector3([0.5, 3.0, 4.0]);
    lightDir.normalize();
    gl.uniform3fv(u_lightDirection, lightDir.elements);
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
        // 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , // front
        // 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // right
        // 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , // up
        // 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , // back
        // 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // left
        // 0 , 1 , 1 , 0 , 1 , 1 , 0 , 1 , 1 , 0 , 1 , 1 , // down
        
        //  red cube.
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // front
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // right
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // up
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // back
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // left
        1, 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 , // down

            
        // white cube.
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0, 
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
        // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0

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

