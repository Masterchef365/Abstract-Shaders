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
    
    vec2 sample_coord; 
    const int layers = 6;
    float quant = 2.;
    const float p = 1.592 / float(layers);
    
    for (int layer = 0; layer < layers; layer++) {
        vec3 quant_v;
    	sample_coord = quant_uv(
            ts, 
            quant * pow(2., float(layer)), 
            quant_v
        );
        
        if (gold_noise(sample_coord * u_resolution.xy + 12.608, 99.712) < p) {
            break;
        }
    }
    
    vec2 off = vec2(
        gold_noise(sample_coord * u_resolution.xy + 12.608, 99.712),
        gold_noise(sample_coord * u_resolution.xy + 13.736, 98.016)
    ) * 2. - 1.;
    
    sample_coord += off * 0.264;

    float g = pow(abs(sample_coord.x), 1.392);
    float d = abs(g) / 1.528;
    vec3 color = d * mix(
        vec3(1.000,0.321,0.803), 
        vec3(0.430,0.505,1.000), 
        (sample_coord.x + 1.) / 2.
    );
    

    gl_FragColor = vec4(color,1.0);
}
