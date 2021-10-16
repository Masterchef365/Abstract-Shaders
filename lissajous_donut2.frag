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
	st.y *= u_resolution.y/u_resolution.x;
	st /= 2.;
	//st.x *= u_resolution.x/u_resolution.y;
	//st /= 2.;

	float l = length(st);

	vec3 color = vec3(0.);
	const int steps = 50;
	const float min = -0.060;
	const float width = 0.001;

	if (l < -min || l > min+width+1.) return vec3(0);

	const float stepsf = float(steps);
	for (int i = 1; i <= steps; i++) {
		float p = l - cos(atan(st.y, st.x) * float(i));
		float g = p * l;
		bool line = g > min && g < min + width;
		float j = float(i) / stepsf;
		if (line) color += mix(vec3(1.000,0.319,0.127), vec3(1.000,0.229,0.814), j);
	}
	color /= stepsf / 140.;

	return color;
}

void main() {
	const int AA_DIVS = 9;
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
