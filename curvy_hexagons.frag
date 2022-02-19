// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159274;
const vec2 a = vec2(1., 0.);
const vec2 b = vec2(cos(pi / 3.), sin(pi / 3.));
const vec2 c = vec2(cos(2. * pi / 3.), sin(2. * pi / 3.));

vec3 to_threespace(vec2 st) {
    return vec3(
        dot(st, a),
        dot(st, b),
        dot(st, c)
    );
}

vec2 from_threespace(vec3 threespace) {
    return vec2(threespace.x, (threespace.y + threespace.z) / sqrt(3.));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    
    vec3 thr = to_threespace(st);
    
    
    bool q = true;
    const int steps = 10;
    int count = 0;
    for (int i = 1; i < steps; i++) {
        thr = cos(thr * 3.141592);
        q = q != fract(float(i) * thr.x) < .5;
        q = q != fract(float(i) * thr.y) < .5;
        q = q != fract(float(i) * thr.z) < .5;

        thr /= sqrt(3.);
        count += int(q);
    }

    float r = float(count) / float(steps);
    
    vec3 color = mix(
        mix(vec3(1.), vec3(0.965,0.008,0.063), r),
        mix(vec3(0.397,0.004,1.000), vec3(0.), r),
        r
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
