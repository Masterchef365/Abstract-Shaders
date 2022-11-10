// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;
const float tau = pi * 2.;
const float tau3 = tau / 3.;


vec3 to_threespace(vec2 v) {
    const vec2 a = vec2(cos(tau3 * 0.), sin(tau3 * 0.));
    const vec2 b = vec2(cos(tau3 * 1.), sin(tau3 * 1.));
    const vec2 c = vec2(cos(tau3 * 2.), sin(tau3 * 2.));
    
    return vec3(
        dot(v, a),
        dot(v, b),
        dot(v, c)
    );
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 0.580;

    float quant = 3.536 * pow(abs(fract(u_time / 100.)-0.5) * 3., 2.);
    
    vec3 th = to_threespace(st);
    vec3 thf = to_threespace(st + vec2(0., sqrt(2.)/2.));
    
    vec3 g = fract(th * quant);
    vec3 f = floor(thf * quant);
    
    const float s = 0.666666;
    bvec3 j = lessThan(g, vec3(s));
    bvec3 k = greaterThan(g, vec3(1. - s));
    
    vec3 color = vec3(
        all(j),
        all(k),
        !all(j) && !all(k)
    );
    
    st = floor(th.xy * 200. + u_time * 10. * color.xz - color.zy * 1110.404);
    float m = rand(st);
    color = vec3(dot(color, vec3(0.15,0.5,0.85)) > m) * vec3(1.000,0.860,0.198);
    
    //color = mix(color, f/2.5, 0.5);

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
