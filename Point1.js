var vssrc = 
'void main() {\n' +
'  gl_Position = vec4(0.5, 0.0, 0.0, 1.0);\n' +
'  gl_PointSize = 10.0; \n' +
'}\n'

var fssrc = 
'void main() {\n' +
'  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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


    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
}