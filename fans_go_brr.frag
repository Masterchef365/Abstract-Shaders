// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	st = st * 2. - 1.;
    
    float space = length(st) * 4e1;
    const float tau = 3.141592 * 2.;
    float a = atan(st.y, st.x) / tau + 0.5;
    
    float innerspace = abs(fract(space*2.)-0.5)*2.;
    float rounderspace = fract(floor(space + fract(u_time) * 8.)*a);
    
    vec3 color = vec3(
        //fract(space) < 0.5,
		//innerspace,
        abs(rounderspace - 0.5) < 0.03
    );

    gl_FragColor = vec4(color,1.0);
}
