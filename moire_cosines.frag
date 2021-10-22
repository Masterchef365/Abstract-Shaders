// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool surface(vec2 st, float sz, float width) {
    return fract(abs(cos(st.x) + sin(st.y)) * sz) < width;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 4.;
    
    // moire pattern
    const float sz = 8.;
    const float width = 0.3;
        
    bool g = surface(st, sz, width);
    float anim = u_time;
    vec2 wander = vec2(cos(anim), sin(anim / 2.));
    g = g && surface(st + wander, sz, width);
    //g = g || fract(surface * 3. - vec2(0.1)) < 0.1;;

    vec3 color = vec3(g);

    return color;
}

void main() {
    const int AA_DIVS = 1;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
