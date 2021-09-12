// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

mat2 rot2d(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}


void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    
    vec3 g = vec3(0);
    g.x += st.y;
    st *= rot2d(pi*2./3.);
    g.y += st.y;
    st *= rot2d(pi*2./3.);
    g.z += st.y;
    
    const float divs = 6.;
    g = abs(vec3(ivec3(g * divs))) / divs;
    
    
    vec3 color = vec3(g);


    gl_FragColor = vec4(color,1.0);
}
