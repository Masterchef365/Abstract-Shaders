// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool checker(vec2 st) {
    bvec2 k = lessThan(fract(st), vec2(.5));
    return k.x != k.y;
}

float cmin(vec2 v) {
    return min(v.x, v.y);
}

float cmax(vec2 v) {
    return max(v.x, v.y);
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.5);
	
	float zoom = 2.2;
    
    st *= zoom;  

    vec2 circspace = fract(st * 2.);
    bool circ = distance(circspace, vec2(.5)) < 0.320;
    bool line = cmin(abs(circspace - .5)) < 0.036;
    float bound_thresh = floor(zoom * 2.);
    bool circ_in_bound = cmax(abs(st * 2.)) < bound_thresh;
    bool line_in_bound = cmax(abs(st * 2.) + .5) < bound_thresh;
    
    color = mix(vec3(checker(fract(st + .25))), vec3(.5), 0.540);
    if (circ && circ_in_bound) color = vec3(checker(fract(abs(st))));
    if (line && line_in_bound) color = vec3((0.540));
    
    

    gl_FragColor = vec4(color,1.0);
}
