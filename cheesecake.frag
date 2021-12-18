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

const float freq = 5.296;
const float amp = 3.896;
const int iters = 6;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st *= 1.;
    
    mat2 am = rot2d(pi / 4.);
    mat2 bm = rot2d(-3. * pi / 4. + 2.840);//u_time / 50.); // TODO: make the sign of u_time change via i
    
    for (int i = 0; i < iters; i++) {
    	vec2 a = am * st;
		vec2 b = bm * st;

        st = vec2(
            cos(a.x * freq) * a.y,
            cos(b.x * freq) * b.y
        ) * amp;
    }
    
    // Normalized value
    // (amp*sqrt(2))^{iters} used here because things inside of the fov are sqrt(2) from center (1, 1) for instance
    // We rotate several times, so the sqrt accumulates
    float n = length(st) / pow(amp * sqrt(2.), float(iters)); 

    vec3 color = vec3(n < 0.004 * 0.076);
    
    return color;
}

void main() {
    const int AA_DIVS = 4;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    color = mix(
        mix(vec3(1.), vec3(0.530,0.369,1.000), color.x),
        mix(vec3(0.708,0.224,1.000), vec3(0.), color.x),
        color.x
    );
    gl_FragColor = vec4(color, 1.);
}
