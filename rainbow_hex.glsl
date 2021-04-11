// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool stripey(vec2 st) {
    return fract(st.x * 3.168) < 0.5;
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

const float PI = 3.141592;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2. - 1.;
    st *= 1.;

    vec3 color = vec3(0.);
    mat2 wat = rot2d(2.*PI/3.);
    mat2 wat2 = rot2d(-2.*PI/3.);
    
    color = vec3(
        stripey(st),
        stripey(wat * st),
        stripey(wat2 * st)
    );

    gl_FragColor = vec4(color,1.0);
}
