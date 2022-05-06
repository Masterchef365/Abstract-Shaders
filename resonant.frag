// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * vec2(1./2., 2.) - vec2(0., 1.);
    st.x *= u_resolution.x/u_resolution.y;
    
    st.y *= 1.680;

    vec3 color = vec3(0.);
    
    st *= vec2(2., 2.);
    
    float t = u_time;
    
    float f = 0.;
    
    for (int i = 3; i <= 3; i++) {
    //int i = 1;
        float k = pi * float(i);
        float w = 1.;
        float phi = 1.;

        f += sin(k * st.x) * sin(u_time);
    }
    
    color = vec3(f < st.y);

    return color;
}

void main() {
    const int AA_DIVS = 0;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
