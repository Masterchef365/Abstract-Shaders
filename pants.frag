// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float scale = 2.;

bool stripe1d(float dim, float off, float period) {
    return int(fract(dim * scale + off) * period) == 0;
}

bool double_stripe(float dim, float off, float period) {
    return stripe1d(dim, 0., period) || stripe1d(dim, off, period);
}

bool double_stripe2d(vec2 dim, float off, float period, bool stripe) {
    return (double_stripe(dim.x, off, period) && stripe) || 
        (double_stripe(dim.y, off, period) && !stripe);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 1.;
    st -= 0.25;

    
    bool stripes = fract((st.x - st.y) * 41.456) > 0.5;
    vec3 color = vec3(double_stripe2d(st, u_time / 10., 6., stripes));
    
    gl_FragColor = vec4(color,1.0);
}