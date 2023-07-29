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

    //st *= 0.002;
    //st -= vec2(0.330,-0.100) * 3.;
    //st -= vec2(0.900,-0.490) / 50.;

    const float scale = pow(0.296, 2.);
    st *= scale;
 	st -= vec2((-0.413), -0.216);
    
    
    float a = st.x;
    float b = st.y;
    int finish = 0;
    const int steps = 90;
    for (int i = 0; i < steps; i++) {
        float tmp = a * a - b * b + st.x;
        //float tmp = b * b - a * a + st.x;
        b = 2. * a * b + st.y;
        a = tmp;
        if (a*a+b*b > 4.) {
			finish = i;
            break;
        }
    }

    
    float l = length(vec2(a,b));
    vec3 color = vec3(a);
    color = vec3(atan(a, b));


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
