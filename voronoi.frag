// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

const int n_points = 9;
void closefrag(vec2 offset, inout vec2 best, int seed_offset, inout int best_seed) {
    vec2 fp = gl_FragCoord.xy/u_resolution.xy; // Frag position
    const float squares = 10.;
    vec2 squarespace = fp * squares + offset;
    float seed = rand(floor(squarespace)); // seed of the random for this square
    vec2 sp = fract(squarespace); // Squarespace relative position
    
    for (int i = 0; i < n_points; i++) {
        vec2 pos = vec2(
            rand(vec2(seed * 323. + 10., i)),
            rand(vec2(seed * 428.944 + 20., i))
        ) + offset;
        if (distance(pos, sp) < distance(best, sp)) {
            best = pos;
            best_seed = i;
        }
    }
}

void main() {
    vec2 best = vec2(999999999.);
    int best_seed = 0;
    int seed_offset = 0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
    		closefrag(vec2(x,y), best, seed_offset, best_seed);
            seed_offset += 1;
        }
    }
    
    vec3 color = vec3(float(best_seed) / (1. * float(n_points)));

    gl_FragColor = vec4(color,1.0);
}
