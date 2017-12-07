attribute vec4 a_pos;                                    
attribute vec4 a_color;                                  
attribute vec4 a_normal;                                 
uniform mat4 u_mvpMat;                                   
uniform mat4 u_modelMat;                                 
uniform mat4 u_normalMat;                                
varying vec4 v_color;                                    
varying vec3 v_normal;                                   
varying vec3 v_vertexPos;                                

void main() {                                            
    gl_Position = u_mvpMat * a_pos;                        
    v_normal    = normalize(vec3(u_normalMat * a_normal)); 
    v_vertexPos = vec3(u_modelMat * a_pos);                
    v_color     = a_color;                                 
}                                                        

