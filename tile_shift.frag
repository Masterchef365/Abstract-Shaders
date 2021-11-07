// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


const vec2 a = vec2(1., 0.);
const vec2 b = vec2(-.5, sqrt(3.) / 2.);
const vec2 c = vec2(-.5, -sqrt(3.) / 2.);

ivec3 tri_tile(vec2 st) {
    return ivec3(
        dot(st, a),
        dot(st, b),
        dot(st, c)
    );
}

float rand(vec3 co){
	return fract(sin(dot(co, vec3(12.9898,78.233, 3.4234))) * 43758.5453);
}

float slopestep(float x, float slope) {
    return min(fract(x) * slope, 1.) + float(int(x));
}

float lin_slopestep(float x, float part) {
    return slopestep(x / part, part);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float sz = 11.144;
    st *= sz;
    
    vec3 tile = vec3(tri_tile(st));
    float anim = lin_slopestep(u_time, 3.);
    vec3 move = vec3(tri_tile(st + b.yx * (2. / sqrt(3.)) * anim));
    
    float g = rand(tile + vec3(0.902,1.000,0.883));
    float k = rand(move + vec3(0.581,1.000,0.200));
    vec3 color = g < .3 ? vec3(k) : vec3(g);

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
