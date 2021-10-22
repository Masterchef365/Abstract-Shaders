// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool surface(vec2 st, float sz, float width) {
    return fract(abs(cos(st.x) + sin(st.y)) * sz) < width;
}

bool pat(vec2 st, float sz, float width, vec2 scale) {
    bool g = surface(st, sz, width);
    float anim = u_time / 10.;
    vec2 wander = cos(anim * scale);
    g = g && surface(st + wander, sz, width);
    return g;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 4.;
    
    // moire pattern
    const float g = 8.;
    vec3 color = vec3(
        pat(st, g, 0.1, vec2(1., 2.)),
        pat(st, g, 0.1, vec2(1.001, 2.001)),
        pat(st, g, 0.1, vec2(1.002, 2.002))
    );

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
