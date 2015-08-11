/**
 * This script demonstrates Tessellation pipeline of OpenGL 4.0+.
 *
 * It is shorter version of the Low Level Tessellation demo, that uses Synth API
 * for GLSL program loading and camera handling. Also it exploits Uniform Controls inside the shaders
 * instead of direct uniform management in the script.
 *
 * It is based on Tessellation tutorial by Philip Rideout (originally written in C):
 * http://prideout.net/blog/?p=48
 * *
 * ----------------------------------------------------------------------------------------------------
 * WARNING: Do not treat objects returned from "gl" global instance as ordinary JavaScript
 *          objects. They are not dynamic objects - you cannot add to them variable/properties, e.g.:
 *
 *          	var prog = gl.createProgram();
 *          	prog.someNewVariable = 5; // THIS WON'T WORK, but unfortunately you won't
 *                                        // get any error message doing so.
 *
 *          In general do not treat any object returned from Synthclipse's API as dynamic object.
 * ----------------------------------------------------------------------------------------------------
 *
 * Documentation (for Java but it is also valid for JavaScript):
 *
 * - Synthclipse: http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/core/JSSynthclipse.html
 * - ProgramFactory: http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/gl/GLSLProgramFactory.html
 * - GLSLProgram: http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/gl/GLSLProgram.html
 * - GeometryFactory: http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/geom/GeometryFactory.html
 * - CameraManager: http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/core/ICameraManager.html
 * - gl (for OpenGL 3+): http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/gl/GL3Proxy.html
 * - gl (for OpenGL 4+): http://synthclipse.sourceforge.net/scripting/api/index.html?org/synthclipse/scripting/gl/GL4Proxy.html
 */
"use strict";

/*
 * IMPORTANT: Do not forget to set OpenGL version,
 * to one supporting Tessellation Shaders:
 */
Synthclipse.setGLVersion(3, 0);

function Quad() {
	var quadBufferPos = {};
	var quadBufferUV = {};
	var quadBufferColor = {};
	
	var ATT_VERT_POS = 0;
	var ATT_TEX_POS = 1;
	var ATT_VERT_COLOR = 2;
		
	var halfLength = 1.0;
	var minX = -halfLength;
	var maxX = halfLength;
	var minY = -halfLength;
	var maxY = halfLength;

	var verts = [
		minX, minY, 0.0,
		maxX, minY, 0.0,
		maxX, maxY, 0.0,
		minX, minY, 0.0,
		maxX, maxY, 0.0,
		minX, maxY, 0.0,
	];

	var uv = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];

    var colors = [ 1.0, 1.0, 1.0,1.0, // Red
                   1.0, 1.0, 1.0,1.0, // Green
                   1.0, 1.0, 1.0,1.0, // Blue
                   1.0, 1.0, 1.0,1.0, // White
                   1.0, 1.0, 1.0,1.0, // Cyan
                   1.0, 1.0, 1.0,1.0]; // Magneta
    
    //var vao = gl.createVertexArray();
   // gl.bindVertexArray(vao);
    
    //Position buffer
    quadBufferPos.id = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferPos.id);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	quadBufferPos.itemSize = 3;
	quadBufferPos.numItems = 6;
	
	//Color buffer
	quadBufferColor.id = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferColor.id);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	quadBufferColor.itemSize = 4;
	quadBufferColor.numItems = 6;
	
	//UV buffer
	quadBufferUV.id = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferUV.id);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	quadBufferUV.itemSize = 2;
	quadBufferUV.numItems = 6;

	gl.enableVertexAttribArray(ATT_VERT_POS);
	gl.enableVertexAttribArray(ATT_TEX_POS);
	gl.enableVertexAttribArray(ATT_VERT_COLOR);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferPos.id);
	gl.vertexAttribPointer(ATT_VERT_POS, quadBufferPos.itemSize, gl.FLOAT, false, 0, 0);
		
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferUV.id);
	gl.vertexAttribPointer(ATT_TEX_POS, quadBufferUV.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, quadBufferColor.id);	
	gl.vertexAttribPointer(ATT_VERT_COLOR, quadBufferColor.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindVertexArray(0);

	return {
    	render: function() {
    		// Using VAO. It might not be available on GL ES 2.0, but I'm not sure
    		//gl.bindVertexArray(vao);
    		
    		gl.drawArrays(gl.TRIANGLES, 0, quadBufferPos.numItems);
    		 
    		//gl.bindVertexArray(0);
    	}
    };
}

var program = null;
var quad = null;
var polygonMode = false; //! checkbox[false]

function initShaders() {
	program = ProgramFactory.createProgram("PainterImage");


	program.attachShader("shaders/painter-image.vert");
	program.attachShader("shaders/painter-image.frag"); //! file

	

	program.link();
	
	
	
    program.printActiveAttributes();
    out.println();
    program.printActiveUniforms();
}

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	program.use();
	program.applyUniforms();

	quad.render();
}
var model = null
var renderable = {};

renderable.init = function() {
	initShaders();
	// model = GeometryFactory.createTorus(0.5, 1.0, 32, 32);

	quad = Quad();

	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// If we want to have controls in the Uniform Controls View
	// we must create them explicitly:
    Synthclipse.createControls(program);
    Synthclipse.createScriptControls();
    
    CameraManager.useCamera2D();

 
};

renderable.display = function() {
	if (polygonMode) {
		gl.polygonMode(gl.FRONT_AND_BACK, gl.LINE);
	} else {
		gl.polygonMode(gl.FRONT_AND_BACK, gl.FILL);
	}

	drawScene();
};

Synthclipse.setRenderable(renderable);