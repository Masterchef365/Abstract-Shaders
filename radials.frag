// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

// polynomial smooth min
float smin( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

vec2 steppos(int i) {
    return vec2(
        rand(vec2(1., i)),
        rand(vec2(i, 1.))
    );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    float f = 1.;
    
    
    const int steps = 30;
    
    for (int i = 1; i <= steps; i++) {
        float t = u_time / 30.;
        t += rand(vec2(i) * 398.);
        
        float m = fract(t);
    	float k = floor(t);
    
        int y = int(k);
        vec2 p = mix(steppos(i+y), steppos(i+y+1), m);
        
        f = smin(f, distance(p, st), 0.05);
    }
    
    float j = f * 30.;
    
    bool k = fract(j) < 0.1;
    int v = int(mod(floor(j), 3.));
    
    vec3 color;
    if (v == 0) {
		color = vec3(1.000,0.319,0.357);
    } else if (v == 1) {
        color = vec3(1., 0., 0.);
    } else {
        color = vec3(0.035,0.029,0.170);
	}
    
	if (k) {
        color = vec3(1);
    }

    gl_FragColor = vec4(color,1.0);
}
