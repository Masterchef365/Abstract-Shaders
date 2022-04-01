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

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 4.;

    vec3 three = to_threespace(st);
    vec3 perp = to_threespace(st.yx * vec2(-1., 1.));
    vec3 stripespace = three * sqrt(3.) / 4.;
    vec3 interleave = perp / 4.;
    
    bvec3 lines = lessThan(fract(perp), vec3(0.1));
    bvec3 stripes = lessThan(fract(stripespace + interleave), vec3(0.5));
    vec3 color = vec3(lines) * vec3(stripes);
    
    color += vec3(interleave) / 10.;

    gl_FragColor = vec4(color,1.0);
}
