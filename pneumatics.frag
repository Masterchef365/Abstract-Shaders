// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// pneumatic
// Greys and golds
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;

    vec3 color = vec3(0.);
    
    bool frobx = fract(st.x * 3.5) > 0.700 != fract(st.x * 3.224) > 0.100;
    bool froby = fract(st.y * 4. ) > 0.508 && fract(st.y * 9.352 + cos(u_time)) > 0.844;
    bool frob = frobx != froby;
    
    bool nobx = fract(st.x * 3.668) > 0.556 != fract(st.x * 4.144 + u_time * 1.5) > 0.316;
    bool noby = fract(st.y * 4.) > 0.412 && fract(st.y * 8.776) > 0.844;
    bool nob = nobx != noby;
    
    const vec3 orange = vec3(0.910,0.544,0.064);
    const vec3 gray = vec3(0.447,0.455,0.470);
    const vec3 dark_gray = vec3(0.250,0.250,0.250);
    color = mix(orange, mix(gray, dark_gray, float(nob)), float(frob));

    gl_FragColor = vec4(color,1.0);
}
