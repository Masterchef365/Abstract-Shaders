// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// https://youtu.be/P4ZnISfhbGk

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;

    vec3 color = vec3(0.);
    const int n = 7;
    for (int i = 1; i <= n; i++) {
        float r = 2. * 3.141592 * float(i)/float(n);
        r += float(i) * u_time / 3.;
        vec2 p = vec2(cos(r), sin(r)) * 0.8;
        p.y *= cos(u_time);
        color += min(float(1./pow(distance(st, p) * 18., 2.)), 1.2)
            * vec3(0.745,0.952,1.000);
    }

    gl_FragColor = vec4(color,1.0);
}
