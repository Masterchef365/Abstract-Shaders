// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.14159265;

mat2 rot2d(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

const float TO_EDGE = sqrt(3.)/2.;
const float TO_VERT = 1./2.;

bool hexcons(vec2 st, float stroke) {
    return fract(st.x/3. + u_time / 10.) < 1./3. && fract(st.y/sqrt(3.)) < stroke;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st *= 8.;
    
    const float stroke = 1./50.128;
    bool h = false;
    for (int i = 0; i < 6; i++) {
        h = h || hexcons(st, stroke) || hexcons(st, stroke);
        st *= rot2d(PI/3.);
    }
    
    vec3 color = vec3(h);

    gl_FragColor = vec4(color,1.0);
}
