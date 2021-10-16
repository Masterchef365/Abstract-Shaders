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


vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

float cross_2d(vec2 a, vec2 b) {
	return a.x * b.y - a.y * b.x 
}

void main() {
    vec2 sc = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    sc.x *= u_resolution.x/u_resolution.y;

    float divs = 8.;
    int level = int(length(sc) * divs / sqrt(2.));
    float lvl = float(level) / (divs - 1.);
    
    //sc = complex_mul(sc, )
    
    float q = unit_circ(u_time / 3.)
    
    vec3 color = vec3(lvl);

    gl_FragColor = vec4(color,1.0);
}