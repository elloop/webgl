#ifdef GL_ES                                                               
precision mediump float;                                                   
#endif                                                                     

uniform vec3 u_lightPos;                                                   
uniform float u_specularStrength;                                          
uniform vec3 u_lightColor;                                                 
uniform vec3 u_ambient;                                                    
uniform vec3 u_eyePos;                                                     
varying vec4 v_color;                                                      
varying vec3 v_normal;                                                     
varying vec3 v_vertexPos;                                                  

void main() {                                                              

    vec3 N = normalize(v_normal);                                       
    vec3 L = normalize(u_lightPos - v_vertexPos);               

    float nDotL = max(dot(N, L), 0.0);                     

    vec3 diffuse = u_lightColor * nDotL * vec3(v_color);                     

    vec3 V = normalize(u_eyePos - v_vertexPos);                  

    /* vec3 R = 2 * dot(N, L) * N - L;    // or R = reflect(-L, N); */

    vec3 R = reflect(-L, N);

    float shiness = 32.0;
    vec3 specular = u_specularStrength * pow(max(dot(V, R), 0.0), shiness) * u_lightColor;

    vec3 ambient = u_ambient * v_color.rgb;                             

    gl_FragColor = vec4(diffuse + ambient + specular, v_color.a);       
}                                                                          


