// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st *= 1.;
    
    int r = int(3.104 * 10.);
    ivec2 q = ivec2(st * float(r));
    
    vec3 color = vec3(q.x * q.x + q.y * q.y < (r-1) * r);

    gl_FragColor = vec4(color,1.0);
}
