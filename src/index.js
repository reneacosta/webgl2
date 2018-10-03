"use strict";
console.log("todo fin e por aqui 21");

import {
  initShaderProgram,
  setupInfoPrg,
  initBuffers,
  setRectangle
} from "./utilx";

import { getGL } from "./contextogl";

import { mat4 } from "gl-matrix";

function mainX() {
  var gl = getGL("glcanvas", "webgl2");
  if (!gl) {
    alert("No se inicializo webgl2. No hay GPU o Browser fallo!.");
    return;
  }
  const shaderProgram = initShaderProgram(gl);
  const programInfo = setupInfoPrg(gl, shaderProgram);
  const bufer = initBuffers(gl, programInfo.attribLocations.vertexPosition);
  prepares(
    gl,
    programInfo.attribLocations.vertexPosition,
    bufer.vao,
    programInfo.uniformLocations.resolutionUniformLocation,
    programInfo.program
  );
  camara(
    gl,
    programInfo.uniformLocations.projectionMatrix,
    programInfo.uniformLocations.modelViewMatrix
  );
  pintado(gl, 10, 5, 10, 50, programInfo.uniformLocations.colorLocation);
  pintado(gl, 25, 15, 10, 30, programInfo.uniformLocations.colorLocation);
  var iniciaEn = 40;
  for (var ii = 0; ii < 150; ++ii) {
    pintado(
      gl,
      iniciaEn,
      15,
      10,
      30,
      programInfo.uniformLocations.colorLocation
    );
    iniciaEn += 15;
  }
}

function camara(gl, proyeMatrix, modeloViewMatrix) {
  const fieldOfView = (45 * Math.PI) / 390; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 6.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate

  // Set the shader uniforms

  gl.uniformMatrix4fv(proyeMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(modeloViewMatrix, false, modelViewMatrix);
}

function prepares(gl, vertexPos, vaox, resolutionX, programa) {
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(vertexPos, size, type, normalize, stride, offset);
  //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(programa);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vaox);

  // Pass in the canvas resolution so we can convert from
  // pixels to clipspace in the shader  resolutionX===resolutionUniformLocation
  gl.uniform2f(resolutionX, gl.canvas.width, gl.canvas.height);
}

function pintado(gl, x, y, ancho, alto, colorLoc) {
  setRectangle(gl, x, y, ancho, alto);

  // Set a random color.
  gl.uniform4f(colorLoc, Math.random(), Math.random(), Math.random(), 1);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}
mainX();
