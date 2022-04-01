// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159274;


float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 to_threespace(vec2 st) {
    const vec2 a = vec2(1., 0.);
    const vec2 b = vec2(cos(pi / 3.), sin(pi / 3.));
    const vec2 c = vec2(cos(2. * pi / 3.), sin(2. * pi / 3.));
    return vec3(
        dot(st, a),
        dot(st, b),
        dot(st, c)
    );
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/min(u_resolution.x, u_resolution.y)) * 2. - 1.;
    //st.x *= u_resolution.x/u_resolution.y;
    
    
    st *= 15.;
    st.x += u_time;
    

    vec3 three = to_threespace(st);
    
    three = to_threespace(st);
    
    vec3 perp = to_threespace(st.yx * vec2(-1., 1.));
    vec3 stripespace = three * sqrt(3.) / 4.;
    vec3 interleave = perp / 4.;
    
    bvec3 randoff = lessThan(vec3(
        rand(floor(perp.xx)),
        rand(floor(perp.yy)),
        rand(floor(perp.zz))
    ), vec3((0.5)));
    
    interleave += vec3(randoff) / 2.;
    
    bvec3 lines = lessThan(fract(perp), vec3(0.1));
    bvec3 stripes = lessThan(fract(stripespace + interleave), vec3(0.5));
    vec3 color = vec3(any(greaterThan(vec3(lines) * vec3(stripes), vec3(0))));

    
    
    return color;
}

void main() {
    const int AA_DIVS = 0;
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
