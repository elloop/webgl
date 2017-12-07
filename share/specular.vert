
attribute vec4 a_pos;                                            
attribute vec4 a_color;                                          
attribute vec4 a_normal;                                         

uniform mat4 u_mvpMat;                                           
uniform mat4 u_modelMat;                                         

uniform mat4 u_normalMat;                                        
uniform vec3 u_lightPos;                                         
uniform vec3 u_lightColor;                                       

uniform vec3 u_ambient;                                          

uniform float u_specularStrength; 
uniform vec3 u_eyePos;            

varying vec4 v_color;                                            


void main() {                                                    
  gl_Position = u_mvpMat * a_pos;                                


  vec4 vertexPos = u_modelMat * a_pos;                           

  vec3 N = normalize(vec3(u_normalMat * a_normal));         
  vec3 L = normalize(u_lightPos - vec3(vertexPos)); 
  float nDotL = max(dot(N, L), 0.0);                     

  vec3 diffuse = u_lightColor * nDotL * a_color.rgb;                     


  vec3 V = normalize(u_eyePos - v_vertexPos);                  

  /* vec3 R = 2 * (dot(N, L) * N) - L;    // or R = reflect(-L, N); */

  vec3 R = reflect(-L, N);

  float shiness = 32.0;
  vec3 specular = (u_specularStrength * pow(max(dot(V, R), 0.0), shiness) * u_lightColor);

  vec3 ambient = u_ambient * a_color.rgb;                             

  v_color  = vec4(diffuse + ambient + specular, a_color.a);
}                                                                

