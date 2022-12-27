// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;
const float tau = pi * 2.;
const float tau3 = tau / 3.;


vec3 to_threespace(vec2 v) {
    const vec2 a = vec2(cos(tau3 * 0.), sin(tau3 * 0.));
    const vec2 b = vec2(cos(tau3 * 1.), sin(tau3 * 1.));
    const vec2 c = vec2(cos(tau3 * 2.), sin(tau3 * 2.));
    
    return vec3(
        dot(v, a),
        dot(v, b),
        dot(v, c)
    );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;
    //st /= sin(pi/6.);

    vec3 th = to_threespace(st);
    th = fract(th) * 2. - 1.;
    if (th.x < th.y != th.y > th.z != th.x > th.z) th = 1. - th;
    
    vec3 color = vec3(th);
    color *= float(th.x < 1. && th.y < 1. && th.z < 1.);
    
    //color = vec3();

    gl_FragColor = vec4(color,1.0);
}
