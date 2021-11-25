// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pat(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 1.192;

    const float k = 7.864;
    const float a_ngle = 1.;
    //vec2 a = unit_circ(a_ngle);
    float anim = 0.;//fract(u_time / 100.) * 2. * pi;
    //vec2 b = unit_circ(anim * pi * 2.);
    vec2 a = vec2(0);
    vec2 b = vec2((cos(anim) + 1.) / 2.);
    for (int i = 0; i < 2; i++) {
        st = vec2(
            cos(distance(st, b) * k),
            cos(distance(st, a) * k)
        );
    }
    vec3 color = vec3(fract(st.x) < 0.186)
        * mix(
        	vec3(0.049,0.272,0.940) * 3., 
        	vec3(0.993,0.946,1.000), 
        	fract(st.y)
        );

    return color;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    float scale = pow(fract(u_time / 20.), 2.) * 40. + 1.;
    st *= scale;

    st = st * 2. - 1.;
    
    const float tile_size = 0.716;
    vec2 fract_st = fract(st);
    ivec2 quant_st = ivec2(floor(st));

    bvec2 subtile_xy = lessThan(fract_st, vec2(tile_size));
    bool subtile = subtile_xy.x && subtile_xy.y;
    
    if (subtile) {
        return pat(vec2(quant_st) * scale);
    } else {
		return vec3(0);
    }
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
