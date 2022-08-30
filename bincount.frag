// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;

const float spacing = pi / 20.;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy);// * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    float t = mod(u_time, 60.);
    
    float r = atan(st.y, st.x);
    
    vec3 color = vec3(0.);
    int k = int(st.x * 6.);
    
    float mul = 1.;
    for (int i = 0; i < 6; i++) {
        mul *= 2.;
        float rem = mod(t, mul);
        t -= rem;
        color = vec3(rem);
        if (i > k) {
            break;
        }
    }
    

    gl_FragColor = vec4(color,1.0);
}
