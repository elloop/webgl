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
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
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

    // rotate angle 
    var angle = 66.0;
    var tX = 0.5; 

    var uModelMat = new Matrix4();
    // uModelMat.setRotate(angle, 0, 0, 1);
    // uModelMat.translate(tX, 0, 0);

    uModelMat.setTranslate(tX, 0, 0);
    uModelMat.rotate(angle, 0, 0, 1);

    var u_model_mat = gl.getUniformLocation(gl.program, "u_model_mat");
    gl.uniformMatrix4fv(u_model_mat, false, uModelMat.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
