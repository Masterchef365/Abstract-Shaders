// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


vec3 pixel(vec2 coord) {
    vec2 st = (coord/min(u_resolution.x, u_resolution.y)) * 2. - 1.;

    float anim = abs(fract(u_time / 200.) - .5) * 2.;
    float j = pow(anim * 18., 2.) + 10.;
    st = floor(st * j) / j;
    
    float k = 2.552;
    float n = pow(abs(st.x) * k, k) + cos(st.y * 10.);
    vec3 color = vec3(fract(n) < 0.148) * vec3(
        mod(n + 1., 3.), 
        mod(n, 2.), 
        mod(n + 2., 2.)
    );

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
