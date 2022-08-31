
// ------- SNIP HERE --------

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
//float u_time = 10. * 2.776;

const int MAT_BACKGND = 0;
const int MAT_FLOOR = 1;
const int MAT_SPHERE = 2;
const int MAT_SPHERE2 = 3;

const float INFINITY = 9e9;

struct Sdf {
    int mat;
    float dist;
};

Sdf raycast(float t_min, float t_max, vec3 o, vec3 d, float pixelRadius);
Sdf s_union(Sdf a, Sdf b);
Sdf s_diff(Sdf a, Sdf b);
Sdf sphere(vec3 p, vec3 o, float r, int mat);

const int MAX_ITERATIONS = 100;
const float omega_init = 1.1;

vec3 o = vec3(u_time / 10., 0.948, (0));
const float fov = 1.;

const float t_min = 0.01;
const float t_max = 100.;

float smin( float a, float b)
{
    const float k = 0.500;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

float rand(vec3 co){
    return fract(sin(dot(co, vec3(37.493,78.233,23.958))) * 43758.5453);
}

Sdf f(vec3 p) {
    vec3 j = floor(p);
    p = fract(p);
    float dist = smin(
        smin(
            smin(
                distance(p, vec3(0, 0, 0)),
                distance(p, vec3(0, 0, 1))
            ),
            smin(
                distance(p, vec3(0, 1, 0)),
                distance(p, vec3(0, 1, 1))
            )
        ),
        smin(
            smin(
                distance(p, vec3(1, 0, 0)),
                distance(p, vec3(1, 0, 1))
            ),
            smin(
                distance(p, vec3(1, 1, 0)),
                distance(p, vec3(1, 1, 1))
            )
        )
    ) -0.452;
   	return Sdf(MAT_SPHERE2, dist);
}

vec3 f_color(Sdf sdf, vec3 end) {
    if (sdf.mat == MAT_BACKGND) {
    	return vec3(0.);
    } else if (sdf.mat == MAT_SPHERE) {
		return vec3(1.);
    } else if (sdf.mat == MAT_SPHERE2) {
        float j = dot(end, vec3(0.955,0.270,0.399));
		return vec3(fract(j * 20.))
            * mix(vec3(1.000,0.886,0.218), vec3(0.519,0.834,1.000), cos(j * 2.));
    } else if (sdf.mat == MAT_FLOOR) {
		return vec3(fract(end.xz), 0);
    }
}

// o, d : ray origin, direction (normalized)
// t_min, t_max: minimum, maximum t values
// pixelRadius: radius of a pixel at t = 1
// forceHit: boolean enforcing to use the
// Modified from:
// Enhanced Sphere Tracing, Benjamin Keiner, Henry Schäfer, 
// STAG: Smart Tools & Apps for Graphics (2014)
Sdf raycast(float t_min, float t_max, vec3 o, vec3 d, float pixelRadius) {
    float omega = omega_init;
    float t = t_min;
    float candidate_error = INFINITY;
    float candidate_t = t_min;
    float previousRadius = 0.;
    float stepLength = 0.;

    Sdf sdf = f(o);
    float functionSign = sdf.dist < 0. ? -1. : +1.;

    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        sdf = f(d*t + o);
        float signedRadius = functionSign * sdf.dist;
        float radius = abs(signedRadius);

        bool sorFail = omega > 1. && (radius + previousRadius) < stepLength;

        if (sorFail) {
            stepLength -= omega * stepLength;
            omega = 1.;
        } else {
            stepLength = signedRadius * omega;
        }

        previousRadius = radius;

        float error = radius / t;
        if (!sorFail && error < candidate_error) {
            candidate_t = t;
            candidate_error = error;
        }

        if (!sorFail && error < pixelRadius || t > t_max)
            break;

        t += stepLength;
    }

    if ((t > t_max || candidate_error > pixelRadius)) {
        return Sdf(MAT_BACKGND, INFINITY);
    } else {
        t = candidate_t;
        return Sdf(sdf.mat, t);
    }
}


Sdf s_union(Sdf a, Sdf b) {
    if (a.dist < b.dist) {
        return a;
    } else {
        return b;
    }
}

Sdf s_diff(Sdf a, Sdf b) {
    if (a.dist > -b.dist) {
        return a;
    } else {
        return Sdf(b.mat, -b.dist);
    }
}

Sdf sphere(vec3 p, vec3 o, float r, int mat) {
    return Sdf(mat, distance(p, o) - r);
}

mat2 rot2(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

vec3 px_sample(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 d = vec3(st, fov);
    
    d.xz *= rot2(u_time / 30.);
    
    float pixelRadius = 0.5 / u_resolution.x / fov;
    
    Sdf sdf = raycast(t_min, t_max, o, d, pixelRadius);
	vec3 end = d * sdf.dist + o;
    
    vec3 color = f_color(sdf, end);
    
    
    //return vec3(f(vec3(st * 4.272, 0.320)).dist < 0.);

    return color;
}

void main() {
    const int AA_DIVS = 0;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += px_sample(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}


