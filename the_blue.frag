// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    bool it = true;
    const int max_iters = 9;
    //float f = mod(u_time, float(max_iters + 28));
    float f = float(max_iters);
    
    float mixer = 0.;
    for (int i = 0; i < max_iters; i++) {
        st -= vec2(.5);
        st *= rotation2d(u_time / 4.);
        st += vec2(.5);
        
        float base = mix(0.500, mix(-0.211, 0.300, (cos(u_time) + 1.) / 2.), min(f - float(i), 1.));
        float left = base;
        float right = 1. - base;
        it = it == ((st.x < left || st.x > right) || (st.y < left || st.y > right));
    	st = fract(st * 2.);
        if (it) {
            mixer += 1. / float(max_iters);
        } else {
            //break;
        }
    }
    vec3 color = mix(vec3(0.231,0.661,0.965), vec3(0.985,0.946,0.946), mixer);
    

    gl_FragColor = vec4(color,1.0);
}
