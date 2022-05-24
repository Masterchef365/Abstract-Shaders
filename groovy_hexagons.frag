// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;
const float tau = pi * 2.;
const float tau3 = tau / 3.;


vec3 to_threespace(vec2 v) {
    const vec2 a = vec2(cos(tau3 * 0.), sin(tau3 * 0.));
    const vec2 b = vec2(cos(tau3 * 1.), sin(tau3 * 1.));
    const vec2 c = vec2(cos(tau3 * 2.), sin(tau3 * 2.));
    
    return vec3(
        dot(v, a),
        dot(v, b),
        dot(v, c)
    );
}

vec2 from_threespace(vec3 g) {
    return vec2(g.x, (g.y - g.z)) / vec2(1., sqrt(3.));
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    const float quant = 11.888;
    
    vec3 th = to_threespace(st);
    vec2 off2 =  + vec2(1., sqrt(3.)) / 3. / quant;
    vec3 th2 = to_threespace(st + off2);
    
    vec3 g = fract(th * quant);
    vec3 q = floor(th * quant) / quant;
    vec3 q2 = floor(th2 * quant) / quant;
    
    const float s = 2./3.;
    bvec3 j = lessThan(g, vec3(s));
    bvec3 k = greaterThan(g, vec3(1. - s));
    
    vec3 h;
    vec2 r;
    if (all(j) || all(k)) {
        h = q;
        r = from_threespace(h);
    } else {
        h = q2;
        r = from_threespace(h) - off2;
    }
    
    vec3 color = vec3(
        all(j),
        all(k),
        !all(j) && !all(k)
    );
    
    color = vec3(rand(h.xy * (h.zy + 0.876)));
    
    color = vec3(0.);
    r.x += cos(2. * r.y + u_time);
	color.r = cos(length(r) * 8. + u_time);
    color.g = cos(length(r) * 18. + u_time);
    color.b = cos(length(r) * 28. + u_time);

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
