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

float rand(in vec2 co, in float seed){
    return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);
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
    const int layers = 8;
    float quant = 2.;
    const float p = 3. / float(layers);
    
    float j = 0.104;
    for (int layer = 0; layer < layers; layer++) {
        vec3 quant_v;
    	sample_coord = quant_uv(
            ts, 
            quant * pow(2., float(layer)), 
            quant_v
        );
        
        if (rand(sample_coord * u_resolution.xy + 12.608, 99.712) < p) {
            break;
        }
        j += 1.244 / float(layers);
    }
    
    vec2 off = vec2(
        rand(sample_coord * u_resolution.xy + 12.608, 99.712),
        rand(sample_coord * u_resolution.xy + 13.736, 98.016)
    ) * 2. - 1.;
    
    sample_coord += off * -0.280;

    float g = pow(abs(sample_coord.y + sample_coord.x), j);
    float d = abs(g) / 1.528;
    vec3 color = d * mix(
        vec3(1.000,0.321,0.803), 
        vec3(0.430,0.505,1.000), 
        (sample_coord.x + 1.) / 2.
    );
    
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
