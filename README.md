# WebGL

WebGL learning notes.

## Useful Links

- [WebGL Home](https://www.khronos.org/webgl/)
- [WebGL Specification 1.0](https://www.khronos.org/registry/webgl/specs/1.0/)
- [WebGL Specification(Latest Revisions)](https://www.khronos.org/registry/webgl/specs/latest/)
- [WebGL API Reference Card](http://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)
- [MDN WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [GLSL_ES_Specification_1.00.pdf](https://www.khronos.org/registry/OpenGL/specs/es/2.0/)
- [OpenGL ES 2.0 Specification](http://www.khronos.org/registry/gles/specs/es/2.0/)
- [OpenGL® ES 2.0 Reference Pages](https://www.khronos.org/registry/OpenGL-Refpages/es2.0/)


## 01_canvas_api

Canvas drawing api

- fillRect

## 02_simple_webgl

First webgl demo, call gl apis `clearColor` and `clear`

```js
var canvas = document.getElementById('webgl')
var gl = getWebGLContext(canvas)
gl.clearColor(1.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
```

## 03_draw_dot_fixed

Frist demo using shaders. 

```js
var vs = 
'void main() {\n' +
'  gl_Position = vec4(0.5, 0.0, 0.0, 1.0);\n' +
'  gl_PointSize = 10.0; \n' +
'}\n'

var fs = 
'void main() {\n' +
'  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n'

gl.drawArrays(gl.POINTS, 0, 1)
```

## 04_draw_dot_attribute

Draw dots by mouse clicks using `attribute` and `uniform` in GLSL.
 
Mouse listener.

key points:

- `gl.getAttribLocation`

- `gl.getUniformLocation`

- `gl.vertexAttrib[1234][ifv]`

- `gl.uniform[1234][ifv]`

- `canvas.onmousedown`





