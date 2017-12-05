attribute vec4 a_pos;
attribute vec4 a_color;

uniform mat4 u_mvpMat;
varying vec4 v_color;

void main() {
  gl_Position = u_mvpMat * a_pos;
  v_color     = a_color;
}

