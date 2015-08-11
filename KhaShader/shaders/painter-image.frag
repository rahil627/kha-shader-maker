
#ifdef SYNTHCLIPSE_ONLY
#define kore main
#endif


#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex; //! texture["debug1.png", filter: GL_NEAREST]
varying vec2 texCoord;
varying vec4 color;

void kore() {
	vec4 texcolor = texture2D(tex, texCoord) * color;
	texcolor.rgb *= color.a;
	gl_FragColor = texcolor;
}

