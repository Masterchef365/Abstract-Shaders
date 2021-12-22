// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Math
const float pi = 3.141592;
const float tau = 2. * pi;

// Experiment
const int samples_per_slit = 10;
const int n_slits = 2;
const float slit_sep = 0.5;
const float slit_width = slit_sep / 4.;
const float wavelength = 0.124;

// Display
const float wall_width = 0.01;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st.x += 1.748;
 
    // Wall
    bool in_wall = abs(st.x) < wall_width;

    float intensity = 0.;
    float phase = -u_time;
    
    const float slit_step = slit_width + slit_sep;
    const float top = slit_step * float(n_slits - 1) / 2.;
    
    bool line = false;
    
    for (int i = 0; i < n_slits; i++) {
        // Y position of this slit
        float y = top - slit_step * float(i);
        
        // Wall holes
        bool in_slit = abs(st.y - y) < slit_width / 2.;
        in_wall = in_wall && !in_slit;
        
        //float sin_theta = abs(st.y - y) / distance(vec2(0, y), st);
        //line = line || abs(slit_width * sin_theta - wavelength) < 0.001;
        
        // Wave samples
        for (int s = 0; s < samples_per_slit; s++) {
            float k = float(s) / float(samples_per_slit);
          	//k = 0.5;
            float sy = k * slit_width + y - slit_width / 2.;
            float dist = distance(vec2(0, sy), st);
            intensity += cos(phase + tau * (dist / wavelength));
        }
    }
    
    intensity /= float(n_slits * samples_per_slit);
    
	// Left side wave
    float left = cos(phase + tau * (st.x / wavelength));
    
    // Wave transition to the right side
    float trans = clamp((st.x + wall_width / 2.) / wall_width, 0., 1.);
    intensity = mix(left, intensity, trans);

	float sin_theta = abs(st.y) / distance(vec2(0, 0), st);
    line = line || abs(slit_sep * sin_theta - wavelength) < 0.001;
    // Center line
    //in_wall = in_wall || abs(st.y) < wall_width / 3.;

    
   	vec3 color = vec3(in_wall) + vec3(max(intensity, 0.)) + vec3(1., 0., 0.) * vec3(line);
    
    
    gl_FragColor = vec4(color,1.0);
}

