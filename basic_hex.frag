// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.141592653589793;

mat2 rot2d(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

bool hexcons(vec2 st, float stroke) {
    return fract(st.x/3.) < 1./3. && fract(st.y/sqrt(3.)) < stroke;
}

bool hexpart(vec2 st, float stroke, float mul) {
    bool h = false;
    for (int i = 0; i <= 2; i++) {
        vec2 p = st * rot2d(float(i)*PI/3.) + vec2(1./2.,sqrt(3.)/2.) * mul;
        h = h || hexcons(p, stroke);
    }
    return h;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st *= 3.;
    
    const float stroke = 1./50.128;
    bool h = hexpart(st, stroke, 1.) || hexpart(st, stroke, -2.);
    
    vec3 color = vec3(h);

    gl_FragColor = vec4(color,1.0);
}
