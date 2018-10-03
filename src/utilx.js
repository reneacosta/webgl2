var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

//createShader EN WEBGL2
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error en Shaders al compilarlo: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

//createProgram  EN WEBGL2
export function initShaderProgram(gl) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    //var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram)
        );
        gl.deleteProgram(shaderProgram); //esto es en webgl2
        return null;
    }

    return shaderProgram;
}

export function setupInfoPrg(gl, shaderProgramx) {
    //projectionMatrix: gl.getUniformLocation(shaderProgramx, 'uProjectionMatrix'),
    //modelViewMatrix: gl.getUniformLocation(shaderProgramx, 'uModelViewMatrix'),
    return {
        program: shaderProgramx,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgramx, "a_position")
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgramx,
                "uProjectionMatrix"
            ),
            modelViewMatrix: gl.getUniformLocation(shaderProgramx, "uModelViewMatrix"),
            resolutionUniformLocation: gl.getUniformLocation(
                shaderProgramx,
                "u_resolution"
            ),
            colorLocation: gl.getUniformLocation(shaderProgramx, "u_color")
        }
    };
}

export function initBuffers(gl, vertexPosition) {
    // Create a buffer for the square's positions.

    const positionBuffer = gl.createBuffer();

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        vao: vao
    };
}

// Fill the buffer with the values that define a rectangle.
export function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW
    );
}