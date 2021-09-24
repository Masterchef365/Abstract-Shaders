// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rot2d(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/min(u_resolution.x, u_resolution.y);
    st = st * 2. - 1.; // Normalize to (-1 .. 1)
    
    st *= 8.;

    vec2 q = st;
    const float step = 0.1;
    for (int i = 0; i < 19; i++) {
        q += cos(q.yx) * fract(u_time / 100.) * 8. - q.yx;
        //q *= rot2d(step);
    }
    
    vec3 color = vec3(q, 0.) / 40000.;

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
