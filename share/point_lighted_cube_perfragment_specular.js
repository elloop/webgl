var vssrc = 
    'attribute vec4 a_pos;\n' +
    'attribute vec4 a_color;\n' +
    'attribute vec4 a_normal;\n' +
    'uniform mat4 u_mvpMat;\n' +
    'uniform mat4 u_modelMat;\n' +
    'uniform mat4 u_normalMat;\n' +
    'varying vec4 v_color;\n' +
    'varying vec3 v_normal;\n' +
    'varying vec3 v_vertexPos;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMat * a_pos;\n' +
    '  v_normal    = normalize(vec3(u_normalMat * a_normal));\n' +
    '  v_vertexPos = vec3(u_modelMat * a_pos);\n' +
    '  v_color     = a_color;\n' +
    '}\n';

var fssrc = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_lightPos;\n' +
    'uniform float u_specularStrength;\n' +
    'uniform vec3 u_lightColor;\n' +
    'uniform vec3 u_ambient;\n' +
    'uniform vec3 u_eyePos;\n' +
    'varying vec4 v_color;\n' +
    'varying vec3 v_normal;\n' +
    'varying vec3 v_vertexPos;\n' +
    'void main() {\n' +
    // v_normal may be not normalized after interpolate.
    '  vec3 normal = normalize(v_normal);\n' +
    '  vec3 lightDirection = normalize(u_lightPos - v_vertexPos);\n' +
    '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
    '  vec3 diffuse = u_lightColor * vec3(v_color) * nDotL;\n' +
    '  vec3 ambientLight = u_ambient * v_color.rgb;\n' +
    '  vec3 viewDirection = normalize(u_eyePos - v_vertexPos);\n' +
    '  vec3 reflectDirection = reflect(-lightDirection, v_normal);\n' +
    '  float spe = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);\n' +
    '  vec3 specular = (u_specularStrength * spe * u_lightColor) * v_color.rgb;\n' +
    '  gl_FragColor = vec4(diffuse + ambientLight + specular, v_color.a);\n' +
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

    var n = initVertexBuffers(gl);

    var u_lightColor       = gl.getUniformLocation(gl.program, "u_lightColor");
    var u_lightPos         = gl.getUniformLocation(gl.program, "u_lightPos");
    var u_ambient          = gl.getUniformLocation(gl.program, "u_ambient");
    var u_mvpMat           = gl.getUniformLocation(gl.program, "u_mvpMat");
    var u_normalMat        = gl.getUniformLocation(gl.program, "u_normalMat");
    var u_modelMat         = gl.getUniformLocation(gl.program, "u_modelMat");
    var u_eyePos           = gl.getUniformLocation(gl.program, "u_eyePos");
    var u_specularStrength = gl.getUniformLocation(gl.program, "u_specularStrength");

    gl.uniform1f(u_specularStrength, 0.5);

    // light color
    gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);  // white light

    // light position
    var lightPos = new Vector3([1, 1.0, 3.0]);
    gl.uniform3fv(u_lightPos, lightPos.elements);

    // ambient light.
    var ambient = new Vector3([0.2, 0.2, 0.2]);
    gl.uniform3fv(u_ambient, ambient.elements);

    // model mat
    var modelMat = new Matrix4();
    modelMat.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(u_modelMat, false, modelMat.elements);
    
    // mvp
    var mvpMat = new Matrix4();
    mvpMat.setPerspective(30, canvas.width / canvas.height, 1, 100);
    var eyePos = new Vector3([6, 6, 14]);
    mvpMat.lookAt(eyePos.elements[0], eyePos.elements[1], eyePos.elements[2], 0, 0, 0, 0, 1, 0);
    mvpMat.multiply(modelMat);
    gl.uniformMatrix4fv(u_mvpMat, false, mvpMat.elements);
    gl.uniform3fv(u_eyePos, eyePos.elements);

    // normal mat, (inverse of & transpose of modelMat)
    var normalMat = new Matrix4();
    normalMat.setInverseOf(modelMat);
    normalMat.transpose();
    gl.uniformMatrix4fv(u_normalMat, false, normalMat.elements);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    // draw elements.
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        2  , 2  , 2  , -2 , 2  , 2  , -2 , -2 , 2  , 2  , -2 , 2  , // 0  , 1  , 2  , 3        front
        2  , 2  , 2  , 2  , -2 , 2  , 2  , -2 , -2 , 2  , 2  , -2 , // 4  , 5  , 6  , 7        right
        -2 , 2  , 2  , 2  , 2  , 2  , 2  , 2  , -2 , -2 , 2  , -2 , // 8  , 9  , 10 , 11       up
        2  , 2  , -2 , 2  , -2 , -2 , -2 , -2 , -2 , -2 , 2  , -2 , // 12 , 13 , 14 , 15       back
        -2 , 2  , -2 , -2 , -2 , -2 , -2 , -2 , 2  , -2 , 2  , 2  , // 16 , 17 , 18 , 19       left
        -2 , -2 , 2  , -2 , -2 , -2 , 2  , -2 , -2 , 2  , -2 , 2  , // 20 , 21 , 22 , 23       down
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
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // front
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // right
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // up
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // back
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // left
        // 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , // down
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

