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

float rand_tiles(vec2 st, const vec3 seed) {
    return rand(seed + seed * vec3(tri_tile(st)));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 11.144;
    
    const float parts = 4.;
    float anim = u_time / 2.;
    float anim_a = lin_slopestep(anim + 0., parts);
    float anim_b = lin_slopestep(anim + 4. / 3., parts);
    float anim_c = lin_slopestep(anim + 2. * 4. / 3., parts);
    
    float mask = rand_tiles(st, vec3(23.124, 5234.0, 234.234));

    vec3 color;
    if (mask < 0.164) {
        float k = rand_tiles(
            st + a.yx * base_height_ratio * anim_a, 
            vec3(5234.000,3578.864,4535.951)
        );
        color = mix(vec3(0.225,0.777,1.000), vec3(0.149,0.525,1.000), k);
    } else if (mask < 0.440) {
        float k = rand_tiles(
            st + b.yx * base_height_ratio * anim_b, 
            vec3(5234.000,3578.864,4535.951)
        );
        color = mix(vec3(1.000,0.041,0.672), vec3(0.955,0.436,1.000), k);
    } else if (mask < 0.600) {
       float k = rand_tiles(
            st + c.yx * base_height_ratio * anim_c, 
            vec3(5234.000,3578.864,4535.951)
        );
        color = mix(vec3(1., 0., 1.), vec3(1., 1., 0.), k);
    } else {
        float k = rand_tiles(
            st, 
            vec3(5234.000,3578.864,4535.951)
        );
        color = vec3(k);
    }
    
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
