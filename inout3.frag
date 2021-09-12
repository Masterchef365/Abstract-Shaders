// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    float zoom = abs(fract(u_time / 200.) - .5);
    st *= pow(zoom, 8.) * 10000.;
    
    vec2 g = vec2(0.);
    const int iters = 12;
    for (int i = 0; i < iters; i++) {
        st += cos(st.yx) + st.xy;// + vec2(cos(u_time / 50.));
        g += normalize(st);
    }
    g /= float(iters);
    vec3 color = vec3(g, 0.);
    bvec2 res = lessThan(fract(g * 20.848), vec2(0.05));
    color = vec3(res, 0.);
    color += vec3(fract(length(g) * 8888.) < 0.068);

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
