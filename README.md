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

## 05_multipoints

Draw multiple points using gl buffer.

```js
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

    // draw from buffer[0] to buffer[n-1], count == n.
    gl.drawArrays(gl.POINTS, 0, n);
```

key points:

- `gl.createBuffer`

- `gl.bindBuffer`

- `gl.bufferData`

- `gl.vertexAttribPointer`

- `gl.enableVertexAttribArray`

- `gl.drawArrays(mode, from, count)`

## 06_use_matrix

Rotate, Translate, Scale triangle use matrix.

### rotate 

```js
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

```

### translate

```js
 var tx = 0.5;
    var ty = 0.5;
    var tz = 0.0;

    var uTransMat = new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            tx, ty, tz, 1.0, 
    ]);

    var u_trans_mat = gl.getUniformLocation(gl.program, "u_trans_mat");
    gl.uniformMatrix4fv(u_trans_mat, false, uTransMat);
```

### scale

```js
 var sx = 1.5;
    var sy = 0.5;
    var sz = 1.0;

    var uScaleMat = new Float32Array([
            sx, 0.0, 0.0, 0.0,
            0.0, sy, 0.0, 0.0,
            0.0, 0.0, sz, 0.0,
            0.0, 0.0, 0.0, 1.0,
    ]);

    var u_scale_mat = gl.getUniformLocation(gl.program, "u_scale_mat");
    gl.uniformMatrix4fv(u_scale_mat, false, uScaleMat);

```

## 07_rotating_triangle

Use matrix lib functions, and `requestAnimationFrame` for animation.

```js
var currentAngle = 0.0;

    var uModelMat = new Matrix4();

    var u_model_mat = gl.getUniformLocation(gl.program, "u_model_mat");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, uModelMat, u_model_mat);
        requestAnimationFrame(tick);
    };

    tick();
```

## 08_texture_mapping

Use multiple gl buffers or single buffer with interleaved data.




key points:

1. stride and offset of `vertexAttribPointer`

```js
var elemSize = vertices.BYTES_PER_ELEMENT;
// 4. vertex attribute
var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 3 * elemSize, 0);

var a_point_size = gl.getAttribLocation(gl.program, "a_point_size");
gl.vertexAttribPointer(a_point_size, 1, gl.FLOAT, false, 3 * elemSize, 2 * elemSize);
```


2. varying variable: pass values from vertex shader to fragment shader

```js
var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec4 a_color;\n' +
    'varying vec4 v_color;\n' +
    'void main() {\n' +
    '  gl_Position = a_pos;\n' +
    '  gl_PointSize = 10.0; \n' +
    '  v_color = a_color; \n' +
    '}\n';

var fssrc = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n'+
    'varying vec4 v_color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_color;\n' +
    '}\n';
```

3.  Texture coordinate (u,v) (or (s,t)), `texture2D(u_sampler, v_tex_coord)`.

```js
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

function loadTexture(gl, n, texture, u_sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
```


4. multiple textures.

```js
var fssrc = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_sampler0;\n' +
    'uniform sampler2D u_sampler1;\n' +
    'varying vec2 v_tex_coord;\n' +
    'void main() {\n' +
    '  vec4 color0 = texture2D(u_sampler0, v_tex_coord);\n' +
    '  vec4 color1 = texture2D(u_sampler1, v_tex_coord);\n' +
    '  gl_FragColor = color0 * color1;\n' +
    '}\n';
```




