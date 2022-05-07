#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 a = vec2(-0.530,-0.270);
    vec2 b = vec2(0.610,-0.670);
    
    vec2 d = vec2(0.020,-0.170);
    
    vec2 f = (a + b) / 2.;
    vec2 g = f - d;
    float r = distance(a, b) / 2.;
    vec2 k = normalize(g) * (length(g) - r);
    vec2 end = k + d;
    
    float q = dot(a - st, b - st);
    
    vec3 color = vec3(abs(q));
    
    if (distance(st, d) < 0.05) color = vec3(1., 0., 0.); 
	if (distance(st, end) < 0.05) color = vec3(0., 1., 0.); 
    
    if (distance(st, a) < 0.02) color = vec3(0.943,0.235,1.000); 
    if (distance(st, b) < 0.02) color = vec3(0.399,0.244,1.000); 

    gl_FragColor = vec4(color,1.0);
}
