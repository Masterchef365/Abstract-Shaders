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

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(in vec2 xy, in float seed){
       return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

vec3 mid_quant(vec3 x) {
    return (floor(x) + ceil(x)) / 2.;
}

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

vec2 quant_uv(vec3 threespace, float quant, out vec3 quant_v) {
    vec3 quantv_a = mid_quant(threespace * quant);
    return from_threespace(quantv_a) / quant;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 ts = to_threespace(st);
    
    vec3 quant_a;
    vec2 rev_a = quant_uv(ts, 7.0, quant_a);
    vec2 rev_b = quant_uv(ts, 7.0 * 2., quant_a);

    
//rev = st;
    bool rev_switch = gold_noise(rev_a * u_resolution.xy + 12.920, 99.488) < 0.404;
    vec2 sample_coord = mix(rev_a, rev_b, float(rev_switch));
    
    vec2 off = vec2(
        gold_noise(sample_coord * u_resolution.xy + 12.608, 99.712),
        gold_noise(sample_coord * u_resolution.xy + 13.736, 98.016)
    ) * 2. - 1.;
    
    
    sample_coord += off * 0.996;
    

    float r = atan(rev_a.y, rev_a.x) / (pi * 2.);
    float d = length(rev_a);

    float k = u_time / 100.;
    vec3 color = vec3(fract(r * 3. + d + k) < .5);
    color = vec3(sample_coord, 0);
    

    gl_FragColor = vec4(color,1.0);
}
