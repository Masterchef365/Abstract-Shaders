// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float pi = 3.141592;
const float tau = 2. * pi;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    float r = sqrt(3.) / 2.; // Fit on the screen horizontally
    const int steps = 5;
    for (int i = 0; i < steps; i++) {
        float th = atan(-st.y, -st.x);
        th = ((th / pi) + 1.) / 2.;
        th *= 6.;
        float radial = th;
        
        th = fract(th);
        th = abs(th - .5) * 2.;
        th *= pi / 6.;
        
        bool hexagon = cos(th) * length(st) < r;
       
        
        float angle = pi * 1. / 6. + float(int(radial)) * pi / 3.;
        r /= 3.;
        st -= vec2(cos(angle), sin(angle)) * r * 2.;
        
        int k = int(radial);
        if (k == 0) {
            color = vec3(0xE5, 0, 0) / 255.;
        } else if (k == 1) {
            color = vec3(0xFF, 0x8D, 0) / 255.;
        } else if (k == 2) {
            color = vec3(0xFF, 0xEE, 0) / 255.;
        } else if (k == 3) {
            color = vec3(0x02, 0x81, 0x21) / 255.;
        } else if (k == 4) {
            color = vec3(0, 0x4C, 0xFF) / 255.;
        } else if (k == 5) {
            color = vec3(0x77, 0x00, 0x88) / 255.;
        } 
        
        if (!hexagon) {
            break;
        }
    }

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
