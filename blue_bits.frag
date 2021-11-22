// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st += vec2(0, u_time / 10.);
    st *= 8.;
    
    const float tile_size = 0.716;
    vec2 fract_st = fract(st);
    ivec2 quant_st = ivec2(floor(st));
    
    bvec2 subtile_xy = lessThan(fract_st, vec2(tile_size));
    bool subtile = subtile_xy.x && subtile_xy.y;
    
    float val = rand(vec2(quant_st) * vec2(-0.350,0.570) * 88.);
    float thresh = rand(vec2(quant_st.y) * vec2(0.440,-0.460) * 38.440);
    float rate = rand(vec2(quant_st.y) * vec2(-0.530,-0.860) * 88.440);
    rate /= 10.;
    
    bool anim_tiles = val + abs(cos(rate * u_time)) > thresh;
	vec3 color = vec3(anim_tiles && subtile) * mix(vec3(0), vec3(0., .5, 1.), val);

    return color;
}

void main() {
    const int AA_DIVS = 3;
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
