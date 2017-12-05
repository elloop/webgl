attribute vec4 a_pos;                                    
attribute vec4 a_color;                                  

uniform mat4 u_mvpMat;                                   
uniform mat4 u_modelMat;

attribute vec4 a_normal;                                 
uniform mat4 u_normalMat;

uniform vec3 u_lightColor;                               
uniform vec3 u_lightDirection;                           

uniform vec3 u_ambient;                               

varying vec4 v_color;                                    

void main() {                                            

  gl_Position = u_mvpMat * a_pos;                        

  vec3 normal = normalize(vec3(u_normalMat * a_normal));

  float nDotL  = max(dot(normal, u_lightDirection), 0.0);
  vec3 diffuse = u_lightColor * vec3(a_color) * nDotL;

   v_color = vec4(diffuse + u_ambient, a_color.a); 
  // v_color = vec4(diffuse, a_color.a);                   

//  v_color = a_color;
}                                                        


