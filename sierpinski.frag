// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool rightof(vec2 a, vec2 b) {
	return a.x * b.y < a.y * b.x;
}

bool tri_chk(vec2 a, vec2 b, vec2 c, vec2 st) {
	return rightof(st - c, a - c) && rightof(st - a, b - a) && rightof(st - b, c - b);
}

vec3 pixel(vec2 coord) {
	vec2 st = (coord/u_resolution.xy) * 2. - 1.;
	st.x *= u_resolution.x/u_resolution.y;

	const float rt3o2 = sqrt(3.) / 2.;
	vec2 a = vec2(0., rt3o2);
	vec2 b = vec2(-1., -rt3o2);
	vec2 c = vec2(1., -rt3o2);

	if (!tri_chk(a, b, c, st)) return vec3(0.);

	for (int i = 0; i < 8; i++) {
		vec2 ab = (a + b) / 2.;
		vec2 ac = (a + c) / 2.;
		vec2 bc = (b + c) / 2.;
		if (tri_chk(a, ab, ac, st)) {
			b = ab;
			c = ac;
			continue;
		}
		if (tri_chk(ab, b, bc, st)) {
			a = ab;
			c = bc;
			continue;
		}
		if (tri_chk(ac, bc, c, st)) {
			a = ac;
			b = bc;
			continue;
		}
		return vec3(0.);
	}

	vec3 color = vec3(1.);
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
