// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = 2. * pi;

mat2 rot2d(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

const float freq = 20.;
const float amp = 1.;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    for (int i = 0; i < 2; i++) {
    vec2 a = rot2d(pi / 4.) * st;
		vec2 b = rot2d(3. * pi / 4.) * st;

        st = vec2(
            cos(a.x * freq) * a.y,
            cos(b.x * freq) * b.y
        ) * amp;
    }
    
    vec3 color = vec3(abs(st.x) < 0.02);
    
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
