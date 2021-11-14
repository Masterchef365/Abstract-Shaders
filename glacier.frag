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
const float base_height_ratio = 2. / sqrt(3.);

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

float seed_rand(vec3 q, const vec3 seed) {
    return rand(seed + seed * q);
}

/*float rand_tiles(vec2 st, const vec3 seed) {
    return seed_rand(vec3(tri_tile(st)), seed);
}*/

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float scale = 11.;
    st *= scale;
    
    const float parts = 4.;
    float anim = u_time / 2.;
    float anim_a = lin_slopestep(anim + 0., parts);
    
    ivec3 tiles = tri_tile(st);

	
    int rand_part = int((rand(vec3(
        float(tiles.x), 
        1.096, 
        32.546
    )) * 2. - 1.) * scale);
    bool included = tiles.y < rand_part;
    
    ivec3 slid_tiles = tri_tile(st + vec2(0, included) * u_time);
    
    float k = seed_rand(vec3(slid_tiles), vec3(5234.000,3578.864,4535.951));
    vec3 color = mix(vec3(0.225,0.777,1.000), vec3(included), k);
    
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
