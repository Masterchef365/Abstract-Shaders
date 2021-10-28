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

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    float r = sqrt(3.) / 2.; // Fit on the screen horizontally
    const int steps = 5;
    for (int i = 0; i < steps; i++) {
        float th = atan(-st.y, -st.x);
        th = ((th / pi) + 1.) / 2.;
        th *= 6.;
        float radial = th;
        
        th = fract(th);
        th = abs(th - .5) * 2.;
        th *= pi / 6.;
        
        bool hexagon = cos(th) * length(st) < r;
        if (!hexagon) {
            color = vec3(float(int(radial)) / 6.);
            break;
        }
        
        float angle = pi * 1. / 6. + float(int(radial)) * pi / 3.;
        r /= 3.;
        st -= vec2(cos(angle), sin(angle)) * r * 2.;
        
        color = vec3(1.);
    }

    gl_FragColor = vec4(color,1.0);
}
