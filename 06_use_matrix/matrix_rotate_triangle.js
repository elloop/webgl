var vssrc = 
'attribute vec4 a_pos;\n' +
'uniform mat4 u_rot_mat;\n' +
'void main() {\n' +
'  gl_Position = u_rot_mat * a_pos;\n' +
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

    // rotate angle 
    var angle = 66.0;
    var radian = Math.PI * angle / 180.0;
    var sinb = Math.sin(radian);
    var cosb = Math.cos(radian);

    var uRotMat = new Float32Array([
            cosb, sinb, 0.0, 0.0,
            -sinb, cosb, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 
    ]);

    var u_rot_mat = gl.getUniformLocation(gl.program, "u_rot_mat");
    gl.uniformMatrix4fv(u_rot_mat, false, uRotMat);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
