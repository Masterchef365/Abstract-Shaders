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
    vec3 quantv_a = floor(threespace * quant);
    return from_threespace(quantv_a) / quant;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 ts = to_threespace(st);
    
    vec2 sample_coord; 
    const int layers = 6;
    float quant = 2.;
    const float p = 2. / float(layers);
    
    float j = 0.552;
    //vec2 anim = u_time * vec2(1., 3.) / 100.;
    //vec2 layer_off = vec2(cos(anim.x), sin(anim.y)) / 10.;
    for (int layer = 0; layer < layers; layer++) {
        vec3 quant_v;
        //ts.yx += layer_off;
    	sample_coord = quant_uv(
            ts, 
            quant * pow(2., float(layer)), 
            quant_v
        );
        
        if (gold_noise(sample_coord + 12.608, 99.712) < p) {
            break;
        }
        j += 1.356 / float(layers);

    }
    
    vec2 off = vec2(
        gold_noise(sample_coord + 12.608, 99.712),
        gold_noise(sample_coord + 13.736, 98.016)
    ) * 2. - 1.;
    
    sample_coord += off * -0.280;

    float g = pow(abs(sample_coord.y + sample_coord.x), j);
    float d = abs(g) / 1.528;
    vec3 color = d * mix(
        vec3(0.460,0.442,0.820), 
        vec3(1.000,0.439,0.420), 
        (sample_coord.x + 0.480) / 2.
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
