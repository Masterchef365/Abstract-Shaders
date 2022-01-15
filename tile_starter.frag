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
    st.x *= u_resolution.x/u_resolution.y;

    const float scale = 8.;
    vec2 cellspace = st * scale;
    vec2 cell_id = floor(cellspace) / scale;
    vec2 cell_part = fract(cellspace);
    
    vec3 color = vec3(0.);
    color = vec3(mix(cell_id, cell_part, 0.364), 0);

    gl_FragColor = vec4(color,1.0);
}
