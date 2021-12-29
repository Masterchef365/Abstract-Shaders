// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float mid_quant(float x) {
    return (floor(x) + ceil(x)) / 2.;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 4.672;

    vec3 color = vec3(0.);
    color = vec3(st.y < mix(floor(st.x), ceil(st.x), (cos(u_time * 4.) + 1.) / 2.));
    
    const float w = 0.018;
    if (abs(st.x) < w) color = vec3(1., 0., 0.);
    if (abs(st.y) < w) color = vec3(0., 0.5, 1.);

    return color;
}

void main() {
    const int AA_DIVS = 2;
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
