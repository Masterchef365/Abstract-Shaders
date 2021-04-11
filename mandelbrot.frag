#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    // Move the view around a little bit
    st *= 1.968;
    st -= 0.992;
    st *= 0.0006;
    st += vec2(-0.30479,-0.6526);
    //st *= -0.010;

    // Calculate mandelbrot fractal
    const float thresh = 9999999.;
    const int iterations = 250;
    float r = 0.; // Real part of z
    float i = 0.; // Imaginary part of z
    for (int x = 0; x < iterations; x++) {
        float rn = r * r - i * i + st.x;
        i = 2. * r * i + st.y;
        r = rn;
    }

    return r < thresh;
}

void main() {
    // MSAA
    int hits = 0;
    const int subpix = 8;
    for (int x = 0; x < subpix; x++) {
        for (int y = 0; y < subpix; y++) {
            vec2 px = gl_FragCoord.xy + vec2(x, y) / float(subpix);
            hits += int(pixel(px));
        }
	}
    
    // Coloring
    float avg = float(hits) / float(subpix * subpix);
    vec3 color = vec3(0.);
    if (hits != 0) {
        const vec3 purple = vec3(0.128,0.407,1.000);
        const vec3 red = vec3(0.172,0.995,0.398);
        const vec3 orange = vec3(0.926,1.000,0.083);
        if (avg < .5) {
 			color = mix(purple, red, avg * 2.);
        } else {
            color = mix(red, orange, (avg - .5) * 2.);
        }
        if (avg < 0.3) {
            color *= avg * 4.;
        }
    }
    
    gl_FragColor = vec4(color, 1.);
}
