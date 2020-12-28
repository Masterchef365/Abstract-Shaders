// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;
    
    st.y -= cos(u_time + st.x * 9.) / 5.;

    vec3 color = vec3(0.975,0.945,0.830);
    bool stripe_1 = abs(st.y + cos(u_time + st.x * 3.5) / 5.) < .1;
    bool stripe_2 = abs(st.y + sin(u_time + st.x * 3.) / 5.) < .1;
    if (stripe_1) color = vec3(0.750,0.000,0.441);
    if (stripe_2) color = vec3(0.426,0.750,0.044);
    if (stripe_1 && stripe_2) color = vec3(0.218,0.392,0.750);

    gl_FragColor = vec4(color,1.0);
}
