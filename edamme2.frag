// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float saturate (float x) {
    return min(1.0, max(0.0,x));
}

vec3 saturate (vec3 x) {
    return min(vec3(1.,1.,1.), max(vec3(0.,0.,0.),x));
}

// By Alan Zucconi
// Based on GPU Gems: https://developer.nvidia.com/sites/all/modules/custom/gpugems/books/GPUGems/gpugems_ch08.html
// But with values optimised to match as close as possible the visible spectrum
// Fits this: https://commons.wikimedia.org/wiki/File:Linear_visible_spectrum.svg
// With weighter MSE (RGB weights: 0.3, 0.59, 0.11)
vec3 bump3y (vec3 x, vec3 yoffset) {
	vec3 y = vec3(1.,1.,1.) - x * x;
	y = saturate(y-yoffset);
	return y;
}

vec3 spectral_zucconi6 (float w) {
	// w: [400, 700]
	// x: [0,   1]
	float x = saturate((w - 400.0)/ 300.0);

	const vec3 c1 = vec3(3.54585104, 2.93225262, 2.41593945);
	const vec3 x1 = vec3(0.69549072, 0.49228336, 0.27699880);
	const vec3 y1 = vec3(0.02312639, 0.15225084, 0.52607955);

	const vec3 c2 = vec3(3.90307140, 3.21182957, 3.96587128);
	const vec3 x2 = vec3(0.11748627, 0.86755042, 0.66077860);
	const vec3 y2 = vec3(0.84897130, 0.88445281, 0.73949448);

	return
		bump3y(c1 * (x - x1), y1) +
		bump3y(c2 * (x - x2), y2) ;
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    
    vec3 color = vec3(0.);
    
    st = st * 2. - 1.;
    st *= 0.044;
    st += vec2(0.230,0.660);

    for (int i = 0; i < 17; i++)
    st.xy += cos(st.yx*8.)/3.;

    
    float L = mix(400., 700., fract(st.x*0.264));
    
    color += spectral_zucconi6(L);
    //color *= float(abs(length(color) - st.y*1.5) > 0.01);
    
    //if (length(color) > st.y*1.5)
	//color = vec3(length(color));
    
    color *= -(st.y*1.116 - length(color));
    //color *= (cos(st.y*118.+st.x*99.) + 1.) / 2.;
    
    return color;
}

void main() {
    const int AA_DIVS = 3;
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
