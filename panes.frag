// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 798.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 r = vec2(rand(st), rand(st * 1.1));
    
    vec3 color = vec3(0.);
    st += r / (fract(st.x * 5.) * 800.);
    
    float t = u_time / 8.;
    float m = cos((st.x - st.y) * 3.);
    float f = fract((st.x + st.y + m + t) * 8.);
    color = vec3(f < 0.1);

    return color;
}

void main() {
    const int AA_DIVS = 1;
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
