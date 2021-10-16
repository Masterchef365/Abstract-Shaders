// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x + a.y * b.y,
        //dot(a, b),// = cos(theta) ||a|| ||b||
        a.x * b.y - a.y * b.x
        //cross2d(a, b)// = sin(theta) ||a|| ||b||
    );
}

// Wait so is a hypercomplex number just dot(a, b) then cross(a, b) where a, b are of rank > 3?

const float pi = 3.141592;

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

float cross_2d(vec2 a, vec2 b) {
	return a.x * b.y - a.y * b.x;
}

vec3 pixel(vec2 coord) {
    vec2 sc = (coord/u_resolution.xy) * 2. - 1.;
    sc.x *= u_resolution.x/u_resolution.y;

    float divs = 22.;
    int level = int(length(sc) * divs / sqrt(2.));
    float off = float(level) / (divs - 1.);
    float lvl = off * pi * 30.;
    
    bool q = dot(sc, unit_circ(u_time / 3. + lvl)) < 0. 
        != dot(sc, unit_circ(-u_time / 2. + lvl)) < 0.;
    
    vec3 color = vec3(q) * mix(vec3(0.556,1.000,0.189), vec3(0.109,0.528,0.980), fract(off * 8.));
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