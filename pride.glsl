#version 140
// Sissy hypnosis GLSL shader
// You want to show me your feet oooOOoooOoo
in vec2 position_fg;
uniform vec2 cursor;
uniform int frame;

const float pi = 3.14159274;


vec3 bi_flag(float val) {
    const vec3 red = vec3(214, 2, 112) / 255.0;
    const vec3 purple = vec3(155, 79, 150) / 255.0;
    const vec3 blue = vec3(0, 56, 168) / 255.0;
    if (val < 0.45) {
        return red;
    } else if (val < 0.55) {
        return purple;
    } else {
        return blue;
    }
}

vec3 trans_flag(float val) {
    const vec3 blue = vec3(85, 205, 252) / 255.0;
    const vec3 white = vec3(255, 255, 255) / 255.0;
    const vec3 pink = vec3(247, 168, 184) / 255.0;
    if (val < 0.20) {
        return blue;
    } else if (val < 0.40) {
        return pink;
    } else if (val < 0.60) {
        return white;
    } else if (val < 0.80) {
        return pink;
    } else {
        return blue;
    }
}

vec3 pan_flag(float val) {
    const vec3 pink = vec3(255, 27, 141) / 255.0;
    const vec3 yellow = vec3(255, 218, 0) / 255.0;
    const vec3 blue = vec3(27, 179, 255) / 255.0;
    if (val < 0.33) {
        return pink;
    } else if (val < 0.66) {
        return yellow;
    } else {
        return blue;
    }
}

vec3 lesbian_flag(float val) {
    const vec3 sinopia = vec3(214, 41, 0) / 255.0;
    const vec3 tangerine = vec3(255, 155, 85) / 255.0;
    const vec3 white = vec3(255, 255, 255) / 255.0;
    const vec3 pink = vec3(212, 97, 166) / 255.0;
    const vec3 flirt = vec3(165, 0, 98) / 255.0;
    if (val < 0.20) {
        return sinopia;
    } else if (val < 0.40) {
        return tangerine;
    } else if (val < 0.60) {
        return white;
    } else if (val < 0.80) {
        return pink;
    } else {
        return flirt;
    }
}

vec3 aromantic_flag(float val) {
    const vec3 green = vec3(58, 166, 63) / 255.0;
    const vec3 pistachio = vec3(168, 212, 122) / 255.0;
    const vec3 white = vec3(255, 255, 255) / 255.0;
    const vec3 gray = vec3(170, 170, 170) / 255.0;
    const vec3 black = vec3(0, 0, 0) / 255.0;
    if (val < 0.20) {
        return green;
    } else if (val < 0.40) {
        return pistachio;
    } else if (val < 0.60) {
        return white;
    } else if (val < 0.80) {
        return gray;
    } else {
        return black;
    }
}

void main() {
    float t = float(frame) / 100.0;
    float r = 0.0;
    float g = 0.0;
    vec2 off = position_fg - cursor;
    float angle = atan(off.y, off.x);
    float dist = distance(position_fg, cursor);
    float angie_frac = (angle + pi) / (pi * 2.0);
    float swirl = fract(angie_frac + (dist * 2.0) - t);
    vec3 color = aromantic_flag(swirl);
    gl_FragColor = vec4(color, 1.0);
}
