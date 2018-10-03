export function getGL(nombre, gl2) {
    // Get A WebGL context
    var canvas = document.getElementById(nombre);
    return canvas.getContext(gl2);
}