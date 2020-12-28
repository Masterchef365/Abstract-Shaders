// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

struct SDF {
    float dist;
    vec3 color;
};

SDF sphere(vec3 pos, vec3 origin, vec3 color, float radius) {
    return SDF(
        distance(pos, origin) - radius,
        color
    );
}

SDF octahedron(vec3 pos, vec3 origin, vec3 color, float side) {
    vec3 diff = abs(pos - origin);
    return SDF(
        (diff.x + diff.y + diff.z) - side,
        color
    );
}

SDF cube(vec3 pos, vec3 origin, vec3 color, float side) {
    vec3 pt = pos - origin;
    return SDF(
        distance(pt, clamp(vec3(-side), pt, vec3(side))),
        color
    );
}

SDF sdf_smooth(SDF a, SDF b) {
    float t = abs(cos(a.dist * 30.888 + u_time));
    return SDF(
        mix(a.dist, b.dist, t),
        //a.dist < b.dist ? a.color : b.color
        mix(a.color, b.color, t)
    );
}


SDF sdf_min(SDF a, SDF b) {
    if (a.dist < b.dist) {
        return a;
    } else {
        return b;
    }
}

SDF scene(vec3 pos) {
    return sdf_smooth(
    //return sdf_min(
        sphere(pos, vec3(-0.544, -0.480, (1.800)), vec3(0.721,0.995,0.123), 0.8),
        cube(pos, vec3(0., 0.460, (1.776)), vec3(0.995,0.467,0.002), 0.5)
    );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;
    vec3 initial_ray = vec3(st, 1.);
    vec3 unit_ray = normalize(initial_ray);
	vec3 color = vec3(0.);//vec3(st, 0.);
    
    vec3 pos = initial_ray;
    for (int i = 0; i < 100; i++) {
        SDF hit = scene(pos);
        if (hit.dist < 0.001) {
            color = hit.color;
            break;
        }
        pos += unit_ray * hit.dist;
    }
    //color = vec3(clamp(0., (st.x - st.y) / (st.x + st.y), 1.));
    //color = vec3(st, 0.);

    gl_FragColor = vec4(color,1.0);
}
