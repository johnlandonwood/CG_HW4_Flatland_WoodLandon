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


// Bump Data
var data2 = new Uint8Array (3*texSize*texSize);   // Format grayscale into RGB format
for (var i = 0; i<= texSize; i++)  
    for (var j=0; j<=texSize; j++) {
        data2[3*texSize*i+3*j  ] = rawData2[i*256+j];
        data2[3*texSize*i+3*j+1] = rawData2[i*256+j];
        data2[3*texSize*i+3*j+2] = rawData2[i*256+j];
    }

//Draws in the XZ-plane
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
var tBuffer, tBuffer2;
var texCoordLoc;

////  Move Texture Configuration to a function

function configureTexture(image, width, height) {
    console.log(width, height);
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function configureTexture2(image, width, height) {
    console.log(width, height);
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    ////////  Callback for FileReader to use Image Data File /////
    ////////    provided, and modified, with permission from student in CS 5382 Spring 2022 

    document.getElementById('fileInput').onchange = (e) => {
        // Get the file data from the event variable
        let file = e.target.files[0];
    
        // The JavaScript FileReader is used to load files, such as .txt or .png files
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
    
            // Grab the file from the event variable
            let result = e.target.result;
    
            // Create an HTML <img>, which will we attach the file data to
            let resultImage = new Image();
            //resultImage.src = result;
    
            // Again, create the onload() function before loading the file data
            resultImage.onload = () => {
                // Create a blank canvas and a canvas context
                // Canvas context is used to draw an image to the canvas
                // let canvas = document.getElementById('gl-canvas');
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");
    
                // Render the loaded image to the canvas
                ctx.drawImage(resultImage, 0, 0, resultImage.width, resultImage.height);
    
                // Get the image rendered to the canvas, returns a Uint8ClampedArray
                let imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);
                console.log(imageData);
    
                // Convert to a Uint8Array (not necessary)
                let image = new Uint8Array(resultImage.width * resultImage.height * 4);
                for (let i = 0; i < resultImage.width * resultImage.height * 4; i++) image[i] = imageData.data[i];
    
                // Do something with that image
                configureTexture(imageData, resultImage.width, resultImage.height);
            }
    
            // Start loading the image data
            resultImage.src = result;
        }
    
        // Read the image. Once this is finished, onload() will be called
        // If you want to read a .txt file, use readAsText(file, "utf-8")
        fileReader.readAsDataURL(file);
    }

    document.getElementById('fileInput2').onchange = (e) => {
        console.log("yo")
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
    
            // Grab the file from the event variable
            let result = e.target.result;
    
            // Create an HTML <img>, which will we attach the file data to
            let resultImage = new Image();
            //resultImage.src = result;
    
            // Again, create the onload() function before loading the file data
            resultImage.onload = () => {
                // Create a blank canvas and a canvas context
                // Canvas context is used to draw an image to the canvas
                // let canvas = document.getElementById('gl-canvas');
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");
    
                // Render the loaded image to the canvas
                ctx.drawImage(resultImage, 0, 0, resultImage.width, resultImage.height);
    
                // Get the image rendered to the canvas, returns a Uint8ClampedArray
                let imageData = ctx.getImageData(0, 0, resultImage.width, resultImage.height);
                console.log(imageData);
    
                // Convert to a Uint8Array (not necessary)
                let image = new Uint8Array(resultImage.width * resultImage.height * 4);
                for (let i = 0; i < resultImage.width * resultImage.height * 4; i++) image[i] = imageData.data[i];
    
                // Do something with that image
                configureTexture2(imageData, resultImage.width, resultImage.height);
            }
    
            // Start loading the image data
            resultImage.src = result;
        }
    
        // Read the image. Once this is finished, onload() will be called
        // If you want to read a .txt file, use readAsText(file, "utf-8")
        fileReader.readAsDataURL(file);
    }




    //////////////////////////////////////////////////////////////

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
    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
    texCoordLoc = gl.getAttribLocation( program, "aTexCoord");
    gl.vertexAttribPointer( texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    configureTexture(data, texSize, texSize)

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);
    tBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer2);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
    texCoordLoc = gl.getAttribLocation( program, "aTexCoord");
    gl.vertexAttribPointer( texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    configureTexture2(data2, texSize, texSize);



    // vBuffer3 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices3), gl.STATIC_DRAW);







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


    // Draw the first buffer (vBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the second buffer (vBuffer2)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    // // Draw the third buffer (triangle)
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    // positionLoc = gl.getAttribLocation(program, "aPosition");
    // gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(positionLoc);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);

    


    requestAnimationFrame(render);
}
