// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

struct QuadraticBezier {
	vec2 start;
	vec2 ctrlp;
    vec2 end;
};

const float STROKE = 0.05;

struct Rect {
    vec2 tr;
    vec2 bl;
};

bool scissor(Rect rect, vec2 pos) {
    return pos.x >= rect.bl.x && 
        pos.y >= rect.bl.y && 
        pos.x <= rect.tr.x && 
        pos.y <= rect.tr.y;
}

vec2 viewport(Rect rect, vec2 pos) {
    return (pos - rect.bl) / (rect.tr - rect.bl);
}

bool view_pts(vec2 pos, QuadraticBezier q) {
    const float SIZE = 0.05;
    return length(pos - q.start) < SIZE || 
        length(pos - q.ctrlp) < SIZE || 
        length(pos - q.end) < SIZE;
}

vec3 PiP(vec2 pos, vec3 original_color, QuadraticBezier q) {
    Rect rect = Rect(vec2(-0.170,-0.350), vec2(-0.800,-0.870));
    vec3 new_color = original_color;
    if (scissor(rect, pos)) {
        vec2 view = viewport(rect, pos);
        new_color = vec3(view_pts(view * 2. - 1., q), 0.1, 0.);
    }
    return new_color;
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;
    
    QuadraticBezier q = QuadraticBezier(
        vec2(1.000 * sin(u_time / 8.), -0.790 * sin(u_time / 3.)),
        vec2(0.330 * sin(u_time / 4.), 0.060 * sin(u_time / 7.)),
        vec2(0.840 * sin(u_time / 6.), 0.500 * sin(u_time / 6.5))
    );
    
    vec3 color = vec3(0.);
    //color = vec3(st.x,st.y,abs(sin(0.)));
    color = vec3(view_pts(st, q));
    color = PiP(st, color, q);
    

    gl_FragColor = vec4(color,1.0);
}