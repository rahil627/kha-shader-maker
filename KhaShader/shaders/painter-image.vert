#ifdef SYNTHCLIPSE_ONLY
#define kore main
#define projectionMatrix synth_ProjectionMatrix
#endif

#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 vertexPosition;
attribute vec2 texPosition;
attribute vec4 vertexColor;

varying vec2 texCoord;
varying vec4 color;

//uniform mat4 synth_ViewMatrix;
//uniform mat4 projectionMatrix;

void kore() {
        gl_Position = vec4(vertexPosition, 1.0);
        texCoord = texPosition;
        color = vertexColor;
}
