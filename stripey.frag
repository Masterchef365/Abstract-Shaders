// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

vec3 hsv2rgb(vec3 c) {
  	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 dither = gl_FragCoord.xy;
    float square = 50. * tan(u_time);
    if (fract(dither.x / square) > .5 != fract(dither.y / square) > .5) {
        dither += square;
    }  
    
    vec2 st = dither/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    vec2 circle_coords = fract(st * 4.);
    float t = u_time;
    
    bool rev = fract(st * 2.).x > .5 != fract(st * 2.).y > .5;
    if (rev) circle_coords = 1. - circle_coords;
    if (rev) t *= -1.;
    
    circle_coords *= mat2(cos(t), -sin(t),
                          sin(t), cos(t));
    float v = (atan(circle_coords.y, circle_coords.x) + pi) / (2. * pi);
    v *= 2.;
    if (rev) v *= -1.;
    if (rev) v += 5.;
     
    float len = length(circle_coords);
    //if (len > 0.333 && len < 0.666) {
    	const float colors = 8.;
        color = hsv2rgb(vec3(float(int(v * colors)) / colors, 1., 1.));
    //}

    gl_FragColor = vec4(color,1.0);
}
