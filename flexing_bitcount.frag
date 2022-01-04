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

    st += st.yx * pow(cos(u_time / 10.), 2.);
    st *= 1.;

    const int steps = 7;
    int samples = 0;
    for (int i = 0; i < steps; i++) {
        float mag = pow(2., float(i));
        vec2 space = fract(st * mag);
    	bvec2 k = lessThan(space, vec2(.5));
    	samples += int(k.x != k.y);
    }
    
    float r = float(samples) / float(steps);
    
    vec3 color = mix(
        mix(vec3(1), vec3(0.990,0.114,0.314), r),
        mix(vec3(0.082,0.128,1.000), vec3(0.089,0.042,0.215), r),
        r
	);

    gl_FragColor = vec4(color,1.0);
}
