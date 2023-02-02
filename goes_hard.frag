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

float proj(vec2 u, vec2 v) {
    return dot(u, v) / dot(v, v);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    const int steps = 20;
    
    // First two entries are position, last is distance
    vec3 shortest = vec3(99999999); 
    vec3 snd_shortest = vec3(99999999);
    
    for (int i = 1; i <= steps; i++) {
        vec2 p = vec2(rand(vec2(i, 10)), rand(vec2(10, i)));
        
        float dist = distance(p, st);
                
        if (dist < snd_shortest.z) {
            snd_shortest = vec3(p, dist);
        } else if (dist < shortest.z) {
            snd_shortest=shortest;
            shortest = vec3(p, dist);
        }
        
        //float k = float(i)/float(steps);
    }
    
    vec3 color = vec3(shortest.xyz);
    vec2 diff = snd_shortest.xy - shortest.xy;
    float k = proj(st - shortest.xy, diff);
    float ref = length(diff);
    
    color.b = float(fract(k * 8. + u_time / 3.) < 0.5);
    
    if (k < 0.436) {
        color = vec3(1);
    }
    
    //color = vec3(snd_shortest);

    gl_FragColor = vec4(color,1.0);
}
