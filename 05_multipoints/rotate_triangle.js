var vssrc = 
'attribute vec4 a_pos;\n' +
'uniform float u_sinb;\n' +
'uniform float u_cosb;\n' +
'void main() {\n' +
'  gl_Position.x = a_pos.x * u_cosb - a_pos.y * u_sinb;\n' +
'  gl_Position.y = a_pos.x * u_sinb + a_pos.y * u_cosb;\n' +
'  gl_Position.z = a_pos.z;\n' +
'  gl_Position.w = 1.0;\n' +
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // rotate angle 
    var angle = 45.0;
    var u_sinb = gl.getUniformLocation(gl.program, "u_sinb");
    var u_cosb = gl.getUniformLocation(gl.program, "u_cosb");
    var radian = Math.PI * angle / 180.0;
    var sinb = Math.sin(radian);
    var cosb = Math.cos(radian);
    gl.uniform1f(u_cosb, cosb);
    gl.uniform1f(u_sinb, sinb);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
