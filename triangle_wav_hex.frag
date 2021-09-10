
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/*bool stripey(vec2 st) {
    return fract(st.x * 3.168) < 0.5;
}*/

float stripey(vec2 st) {
    return float(int(st.x * 2.)) / 2.;
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

float rand3d(in vec3 v) {
    return fract(sin(dot(v + vec3(72.272,60.540,342.000), vec3(35.673,93.321,65.406))) * 341.598);
}

const float PI = 3.141592;

float triangle(float v) {
    return abs(.5 - fract(v));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2. - 1.;
    const float scale = 3.;
    st *= scale;

    vec3 color = vec3(0.);
    mat2 rot_a = rot2d(2.*PI/3.);
    mat2 rot_b = rot2d(-2.*PI/3.);
    
    vec2 rot_a_st = rot_a * st;
    vec2 rot_b_st = rot_b * st;
    vec3 v = vec3(
        triangle(st.y),
        triangle(rot_a_st.y),
       	triangle(rot_b_st.y)
    );
    
    //v = (cos(v * u_time) + 1.) / 2.; // Animate
    
    color = vec3(length(v) < 0.300);

    gl_FragColor = vec4(color,1.0);
}
