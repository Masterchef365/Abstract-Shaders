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
    
    st = 2. * st;
    
    float k = 20.;
    vec2 px = floor(st * k);

    float v = 6.;
    px.y += abs(v - mod(px.x, v*2.));
    bool b = mod(px.y, 4.) == 0. && mod(px.y, 4.*5.) < 4.*3.;
    
    if (mod(px.x, 2.) == 0.) b = !b;
    
    vec3 color = vec3(b);
    
    gl_FragColor = vec4(color,1.0);
}
