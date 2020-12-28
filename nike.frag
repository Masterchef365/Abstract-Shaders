// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sideways(float v) {
    return abs(fract(v * 10.) - .5);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    bool r = sideways(st.x + st.y) + sideways(st.x - st.y + u_time / 20.) > st.x;
    bool g = sideways(st.x + st.y) + sideways(st.x - st.y + u_time / 10.) > st.y;
    bool b = sideways(st.x + st.y) + sideways(st.x - st.y + u_time / 5.) > st.y + st.x;
    //float height = cos(st.x * 100. + u_time * 10.) * cos(st.y * 100.); 
    vec3 color = vec3(r, g, b);
    //color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}
