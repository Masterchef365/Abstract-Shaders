// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float l = length(st);
    
    vec3 color = vec3(0.);
    const int steps = 30;
    const float stepsf = float(steps);
    for (int i = 1; i <= steps; i++) {
        float p = l - cos(atan(st.y, st.x) * float(i));
        float g = p * l;
        const float min = -0.128;
        const float width = 0.001;
        bool line = g > min && g < min + width;
        float j = float(i) / stepsf;
        if (line) color += mix(vec3(0.194,1.000,0.164), vec3(0.269,0.797,1.000), j);
    }
    color /= stepsf / 100.;

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