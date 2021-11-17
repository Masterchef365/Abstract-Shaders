// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = 2. * pi;

const vec2 a = vec2(cos(0.), sin(0.));
const vec2 b = vec2(cos(tau / 3.), sin(tau / 3.));
const vec2 c = vec2(cos(2. * tau / 3.), sin(2. * tau / 3.));

vec3 tri_tile(vec2 st) {
    return vec3(
        dot(st, a),
        dot(st, b),
        dot(st, c)
    );
}

vec2 un_tri_tile(vec3 v) {
    v /= 1.5;
    return v.x * a + v.y * b + v.z * c;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    const float sz = 3.560;
    st *= sz;
    
    vec3 tile = tri_tile(st);
    vec3 quant_tile = floor(tile);
    vec2 nearest_st = un_tri_tile(quant_tile);
    
    vec3 color = vec3(0.);
    color = vec3(distance(nearest_st, st));
    //color = vec3(nearest_st - st, 0) / sz;
    //color = vec3(nearest_st, 0) / sz;

    gl_FragColor = vec4(color,1.0);
}
