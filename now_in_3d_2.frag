// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 norma(vec2 v) {
    return v * 2. - 1.;
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
} 

bool rect_prism(vec3 p, vec3 size) {
    return all(greaterThan(p, -size)) && all(lessThan(p, size));
}

bool chaos(vec3 p) {
    vec3 q = vec3(0.);
    bool wonk = false;
    for (int i = 2; i < 9; i++) { 
        float m = float(i);
    	q += cos(p * vec3(8. - m, 3. * m, 3.) + q.zxy);
        wonk = wonk != abs(q.x) < 0.02 || abs(q.y) < 0.004;
    }
    return wonk;
}

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(-0.070,-0.020), 1.616);
    vec3 p = v - pos;
    p.zx *= rot2d(-35.288);
    p.xy *= rot2d(-38.896);
    
    bool prism = rect_prism(p, vec3(0.685,0.685,0.685));
    float k, q;
    
    bool inside = chaos(p);
    inside = inside && prism;
    
    
    vec3 color = abs(p);
    color *= float(inside);
    return color;
}

vec3 sample(vec2 spos) {
    vec2 st = norma(spos/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 400;
    const float step = (far - near) / float(iters);
    const float brightness = 30.760 / float(iters); // Amount accumulated per-step
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += shape(pos);
        pos += ray * step;
    }
	color *= brightness;
   	return color;
}


void main() {
    const int AA_DIVS = 2;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += sample(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
