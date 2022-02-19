// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

mat2 rot2(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    
    bool q = true;
    const int steps = 12;
    int count = 0;
    for (int i = 1; i < steps; i++) {
        vec2 k = st;
        //k += u_time / float(i) / 50.;
        //k += unit_circ(u_time / 50. + float(i) * 3.141592);
        k = k * rot2(float(i) * 3.141592 / 3.);
        
        q = q == fract(float(i) * k.x) < .5;
        q = q != fract(float(i) * k.y) < .5;
        
        //st /= sqrt(2.);
        count += int(q);
    }
    
    float r = float(count) / float(steps);
    color = hsv2rgb(mix(
        vec3((0.520), 1.216, 1.128),
        vec3((0.592), 0.952, 0.112),
        r
    ));

    return color;
}

void main() {
    const int AA_DIVS = 2;
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
