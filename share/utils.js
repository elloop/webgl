var vssrc = null;
var fssrc = null;

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

