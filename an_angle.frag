
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

bool quadratic(float a, float b, float c, out float p, out float q) {
    // Check for any intersection
    float g = b * b - 4. * a * c;
    if (g < 0.) {
        return false;
    }
    
    // Decide closest intersection 
	float a2 = 2. * a;
    float j = -b / a2;
    float k = sqrt(g) / a2;
    p = j + k;
    q = j - k;
	return true;
}

bool mandelbrot(vec3 coord) {
    vec2 st = coord.xz/u_resolution.xy;
    // Move the view around a little bit
    st *= 1.968;
    st -= 0.992;
    st *= 0.0006;
    st += vec2(-0.30479,-0.6526);
    //st *= -0.010;

    // Calculate mandelbrot fractal
    const float thresh = 9999999.;
    const int iterations = 40;
    float r = 0.; // Real part of z
    float i = 0.; // Imaginary part of z
    for (int x = 0; x < iterations; x++) {
        float rn = r * r - i * i + st.x;
        i = 2. * r * i + st.y;
        r = rn;
    }

    return r < thresh;
}

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(-0.070,-0.020), 1.616);
    vec3 p = v - pos;
    p.zx *= rot2d(-37.064);
    p.xy *= rot2d(-37.232);
    
    bool prism = rect_prism(p, vec3(0.575,0.575,0.575));
    float k, q;
    
    bool inside = mandelbrot(p);
    inside = inside && prism;
    
    
    vec3 color = abs(p);
    color *= float(inside);
    return color;
}

void main() {
    vec2 st = norma(gl_FragCoord.xy/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 10;
    const float step = (far - near) / float(iters);
    const float brightness =  2.496 / float(iters); // Amount accumulated per-step
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += shape(pos);
        pos += ray * step;
    }
	color *= brightness;

    gl_FragColor = vec4(color,1.0);
}

