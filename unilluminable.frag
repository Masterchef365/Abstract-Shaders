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

    vec3 color = vec3(0.);
    
    st *= 1.1;
    
    st = abs(st);
    
    const float a = 1.;
    const float b = 0.512;
    const float d = 0.240;
    const float w = 0.034;
    const float c = sqrt(a*a - b*b);
    const float l = a - c;
    const float r = sqrt(l*l + d*d);
    
    bool centerline = abs(st.y) < w;
    bool right = st.x > c;
    bool radial = length(st - vec2(a, 0.)) < r;
    bool ellipses = sqrt(1. - st.x * st.x) > (st.y - d) / b;
    bool room = ellipses && !(centerline && right) && !(radial && !right);
    
    //bool arc = 
    color = vec3(room);

    gl_FragColor = vec4(color,1.0);
}
