#ifdef SYNTHCLIPSE
#include <synthclipse>
#endif

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex; //! texture["debug1.png", filter: GL_NEAREST]
varying vec2 texCoord;
varying vec4 color;

uniform vec2 resolution; //! slider[(1,1), (800,600), (1920,1080)]
uniform float stitching_size;//! slider[0, 10, 100]
uniform int invert;  //! checkbox[false]

vec4 PostFX(sampler2D tex, vec2 uv)
{
  vec4 c = vec4(0.0);
  float size = stitching_size;
  vec2 cPos = uv * vec2(resolution.x, resolution.y);
  vec2 tlPos = floor(cPos / vec2(size, size));
  tlPos *= size;
  int remX = int(mod(cPos.x, size));
  int remY = int(mod(cPos.y, size));
  if (remX == 0 && remY == 0)
    tlPos = cPos;
  vec2 blPos = tlPos;
  blPos.y += (size - 1.0);
  if ((remX == remY) ||
     (((int(cPos.x) - int(blPos.x)) == (int(blPos.y) - int(cPos.y)))))
  {
    if (invert == 1)
      c = vec4(0.2, 0.15, 0.05, 1.0);
    else
      c = texture2D(tex, tlPos * vec2(1.0/resolution.x, 1.0/resolution.y)) * 1.4;
  }
  else
  {
    if (invert == 1)
      c = texture2D(tex, tlPos * vec2(1.0/resolution.x, 1.0/resolution.y)) * 1.4;
    else
      c = vec4(0.0, 0.0, 0.0, 1.0);
  }
 c*=color;
  return c;
}

void kore ()
{
  vec2 uv = texCoord.st;

    gl_FragColor = PostFX(tex, uv);

}

void main(){
	kore();
}

