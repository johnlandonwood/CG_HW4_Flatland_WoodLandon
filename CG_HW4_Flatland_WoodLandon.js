"use strict";

var canvas;
var gl;

var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var texSize = 256;

// Bump Data
var data = new Uint8Array (3*texSize*texSize);   // Format grayscale into RGB format
for (var i = 0; i<= texSize; i++)  
    for (var j=0; j<=texSize; j++) {
        data[3*texSize*i+3*j  ] = rawData[i*256+j];
        data[3*texSize*i+3*j+1] = rawData[i*256+j];
        data[3*texSize*i+3*j+2] = rawData[i*256+j];
    }

// Draws in the XZ-plane
var vertices = [
    vec4(0.0,  0.0,  0.0,  1.0),
    vec4(1.0,  0.0,  0.0,  1.0),
    vec4(1.0,  0.0,  1.0,  1.0),
    vec4(0.0,  0.0,  1.0,  1.0)
];

// Draws in the XY plane
var vertices2 = [
    vec4(0.0,  0.0,  0.0,  1.0),
    vec4(1.0,  0.0,  0.0,  1.0),
    vec4(1.0,  1.0,  0.0,  1.0),
    vec4(0.0,  1.0,  0.0,  1.0)
];

// Triangle
var vertices3 = [
    vec4(0.5,  0.0,  0.0,  1.0),
    vec4(0.0,  0.5,  0.0,  1.0),
    vec4(0.0,  0.0,  0.5,  1.0),
];

var texCoords = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1)
];

var modelViewMatrix, projectionMatrix, nMatrix;

var program;

var vBuffer, vBuffer2, vBuffer3;
var positionLoc;

// Different variable for each texture
var texture1, texture2, texture3;

// Variable to control which texture is being set in the file inputs
var flag = -1;

// Configure textures based on flag
function configureTextures(image, width, height, flag) {
    switch(flag) {
        case 0:
            console.log(flag)            
            texture1 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        case 1:
            texture2 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture2);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        case 2:
            texture3 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture3);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    }
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    document.getElementById('fileInput1').onchange = (e) => {
        flag = 0;
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            let result = e.target.result;
            let resultImage = new Image();
            resultImage.onload = () => {

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");
    
                ctx.drawImage(resultImage, 0, 0, resultImage.width, resultImage.height);
    
                let imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);
                console.log(imageData);
    
                let image = new Uint8Array(resultImage.width * resultImage.height * 4);
                for (let i = 0; i < resultImage.width * resultImage.height * 4; i++) image[i] = imageData.data[i];
                configureTextures(imageData, resultImage.width, resultImage.height, flag)
            }
            resultImage.src = result;
        }

        fileReader.readAsDataURL(file);
    }

    document.getElementById('fileInput2').onchange = (e) => {
        flag = 1;
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            let result = e.target.result;
            let resultImage = new Image();
            resultImage.onload = () => {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");
                ctx.drawImage(resultImage, 0, 0, resultImage.width, resultImage.height);
                let imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);
                console.log(imageData);
                let image = new Uint8Array(resultImage.width * resultImage.height * 4);
                for (let i = 0; i < resultImage.width * resultImage.height * 4; i++) image[i] = imageData.data[i];
                configureTextures(imageData, resultImage.width, resultImage.height, flag)
            }
            resultImage.src = result;
        }
        fileReader.readAsDataURL(file);
    }

    document.getElementById('fileInput3').onchange = (e) => {
        flag = 2;
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            let result = e.target.result;
            let resultImage = new Image();
            resultImage.onload = () => {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");
                ctx.drawImage(resultImage, 0, 0, resultImage.width, resultImage.height);
                let imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);
                console.log(imageData);
                let image = new Uint8Array(resultImage.width * resultImage.height * 4);
                for (let i = 0; i < resultImage.width * resultImage.height * 4; i++) image[i] = imageData.data[i];
                configureTextures(imageData, resultImage.width, resultImage.height, flag)
            }
                resultImage.src = result;
        }
        fileReader.readAsDataURL(file);
    }

    canvas.height = 512
    canvas.width = 512

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);

    vBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices3), gl.STATIC_DRAW);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation( program, "aTexCoord");
    gl.vertexAttribPointer( texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    configureTextures(data, texSize, texSize, 0);
    configureTextures(data, texSize, texSize, 1);
    configureTextures(data, texSize, texSize, 2);

    document.getElementById("Button4").onclick = function(){phi += dr;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};

    projectionMatrix = ortho(-1.2, 1.2, -1.2, 1.2, -10.0, 10.0);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix));

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var eye = vec3(2.0, 3.0*(1.0+Math.cos(phi)), 2.0);
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));

    // Draw the first buffer
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the second buffer
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the third buffer (triangle)
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
}