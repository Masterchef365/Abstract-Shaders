// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const vec3 red = vec3(214, 2, 112) / 255.0;
const vec3 purple = vec3(155, 79, 150) / 255.0;
const vec3 blue = vec3(0, 56, 168) / 255.0;

bool double_stripe(vec2 k, bool slats, float low, float hi) {
    bvec2 j = greaterThan(k, vec2(low));
    bvec2 p = lessThan(k, vec2(hi));
    return (j.x && p.x && slats) || (j.y && p.y && !slats);
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st *= 1.;

    vec2 f = fract(st);
    vec2 k = abs(f - 0.5) * 0.880;
    
    //bool slats = fract((st.x + st.y) * 45. + u_time) < 0.5;
	bool slats = fract((st.x + st.y) * 45.) < 0.5;

    vec3 color = red;
    
    const float b1l = 0.156;
    const float b1h = 0.364;
    const float b1c = (b1l + b1h) / 2.;
    
    const float miniwidth = 0.01;
	
    bool black1 = double_stripe(k, slats, b1l, b1h);
    bool black2 = double_stripe(k, slats, 0.02, 0.04);
    
    bool center = double_stripe(k, slats, 0.0, miniwidth);
    
    const float sep = 0.03;
    const float bc1off = b1c - sep;
    const float bc2off = b1c + sep;
    bool blackcenter1 = double_stripe(k, slats, bc1off, bc1off + miniwidth);
    bool blackcenter2 = double_stripe(k, slats, bc2off, bc2off + miniwidth);
    
    bool black = black2 || black1;
    bool blackcenter = blackcenter1 || blackcenter2;
	
    if (black) color = vec3(0.);
    if (blackcenter || center) color = vec3(1.);
    
    bvec2 j = greaterThan(k, vec2(bc2off));
    bvec2 p = lessThan(k, vec2(bc2off + miniwidth));
    
    if (j.y && p.y && !slats) color = vec3(1., 1., 0.);

    gl_FragColor = vec4(color,1.0);
}
