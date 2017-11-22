var vssrc = 
'attribute vec4 a_pos;\n' +
'attribute float a_psize;\n' +
'void main() {\n' +
'  gl_Position = a_pos;\n' +
'  gl_PointSize = a_psize; \n' +
'}\n'

var fssrc = 
'precision mediump float;\n' +
'uniform vec4 u_color;\n' +
'void main() {\n' +
'  gl_FragColor = u_color;\n' +
'}\n'

function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.log('failed to get the rendering context for webgl')
        return
    }

    if (!initShaders(gl, vssrc, fssrc)) {
    	console.log('failed to initialize shaders')
    	return
    }

    var a_pos = gl.getAttribLocation(gl.program, 'a_pos')
    var a_psize = gl.getAttribLocation(gl.program, 'a_psize')

    var u_color = gl.getUniformLocation(gl.program, 'u_color')
    
    if (a_pos < 0 || a_psize < 0) {
        console.log('failed to get storage of a_pos or a_psize')
        return
    }

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_pos, a_psize, u_color)
    }

    // gl.vertexAttrib3f(a_pos, 0.0, 0.2, 0.0)
    // gl.vertexAttrib1f(a_psize, 50.0)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

}

var g_points = []
var g_colors = []
function click(ev, gl, canvas, a_pos, a_psize, u_color) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect()
    x = ((x - rect.left) - canvas.height/2) / (canvas.width/2)
    y = (canvas.width/2 - (y -rect.top)) / (canvas.height/2)
    g_points.push([x, y])

    if (x >= 0 && y > 0) {
        g_colors.push([1.0, 0.0, 0, 1])
    } else if (x < 0 && y < 0) {
        g_colors.push([0, 1, 0, 1])
    } else {
        g_colors.push([1, 1, 1, 1])
    }

    gl.clear(gl.COLOR_BUFFER_BIT)
    var len = g_points.length
    for (var i = 0; i < len; i++) {
        var color = g_colors[i]
        gl.vertexAttrib3f(a_pos, g_points[i][0], g_points[i][1], 0)
        gl.uniform4f(u_color, color[0], color[1], color[2], color[3])
        gl.vertexAttrib1f(a_psize, 10.0)
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}