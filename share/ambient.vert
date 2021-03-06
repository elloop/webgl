attribute vec4 a_pos;                                    
attribute vec4 a_color;                                  
uniform mat4 u_mvpMat;                                   

attribute vec3 a_normal;                                 

uniform vec3 u_lightColor;                               
uniform vec3 u_lightDirection;                           
uniform vec3 u_ambient;                               

varying vec4 v_color;                                    

void main() {                                            

    gl_Position = u_mvpMat * a_pos;                        

    // diffuse
    vec3 normal  = normalize(a_normal);
    float nDotL  = max(dot(normal, u_lightDirection), 0.0);

    vec3 diffuse = u_lightColor * vec3(a_color) * nDotL;

    // ambient
    vec3 ambient = u_ambient * vec3(a_color);

    v_color = vec4(diffuse + ambient, a_color.a); 
}                                                        


