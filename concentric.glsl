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
    st = st * 2. - 1.;;

    vec3 color = vec3(0.);
    const float cells = 80.;
    ivec2 cell = ivec2(st * cells);
    color = vec3(cos(length(vec2((cell)) * 8.) / 8.) < cos(u_time));

    gl_FragColor = vec4(color,1.0);
}
