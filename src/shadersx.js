export function vsShader() {
    //vertexShaderSource
    return `#version 300 es in vec2 a_position; uniform vec2 u_resolution; void main() {vec2 zeroToOne = a_position / u_resolution;vec2 zeroToTwo = zeroToOne * 2.0;vec2 clipSpace = zeroToTwo - 1.0;gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);}`;
}



export function fsShader() {
    //fragmentShaderSource
    return `#version 300 es precision mediump float;uniform vec4 u_color;out vec4 outColor;void main() {outColor = u_color;}`;
}