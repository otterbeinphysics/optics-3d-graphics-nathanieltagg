// Code put here is executed as the page is loading.
// Use this area to initialize global variables.

var gViewport = null;
var ctx = null;
var gWidth = null;
var gHeight = null;

var gT = 0; 		// This will always be set to the current time-since-page-load, in ms
var gdT = 50; 		// This will always be set to the current time-since-last frame, (but capped at something reasonable)
var g_last_frame_t = Date.now();

var gBoxSize;
var gMyCheckbox;
var gCtl2

var gContinuousRedraw = true;

$(function(){
	// Code in this block is executated when the page first loads.

	// This sort of line can be put anywhere: it doesn't show up on the page, but shows up in the "Console"
	// To see your console:
	// On chrome: View / Developer / Javascript Console    (or command-option-j or control-option-j)
	// On firefox: Tools / Web Developer / Web Console
	// Tools also in other browers, but I recommend using one of the two above.
	// Note that you can also issue commands in the console, just like the code here!

	console.log("Hello there intrepid programmer!");

	// This is where you set up your controls.  The name of your control (id="myID") is controlled by attaching 
	// an event hook to #myID

	// How to use an input box:
	gBoxSize = parseInt($('#boxsize').val()); // initialize it

	$('#boxsize').change(function(){
		// This code is run when someone changes the content of the text box.
		gBoxSize = parseInt($(this).val());
		console.log("Changing text box size to",gBoxSize)
	})

	// The check box
	gMyCheckbox = $("#checkbox1").is(":checked");
	$("#checkbox1").change(function(){
		gMyCheckbox = $(this).is(":checked");
		console.log("checkbox is now",gMyCheckbox);
	})

	// The clickable box
	$("#ctl1").click(function(){
		console.log("ctl1 was clicked");
	});

	// The holdable box
	gCtl2 = false;
	$("#ctl2").mousedown(function(){
		console.log("ctl2 was pushed");
		gCtl2 = true;
	});
	$(window).mouseup(function(){ // this is on the whole window in case user's mouse moves off of button while holding it down.
		if(gCtl2){
			console.log("ctl2 was released");
			gCtl2 = false;
		}
	});


	// Set up the view
	gViewport = $('#viewport');
	ctx = gViewport.get(0).getContext('2d');
	gWidth = gViewport.get(0).width = gViewport.innerWidth();
	gHeight = gViewport.get(0).height =gViewport.innerHeight();

	// Set the canvas coordinates up so that the origin is in the center of the viewport
	ctx.translate(gWidth/2,gHeight/2);

	DummyExample();

	// This draws once.
	AnimationFrame();



})

var last_frame = Date.now();
var t0 = Date.now();


function SetTime()
{
	// this function sets the global values gT and gdT to be the time since page update
}

function AnimationFrame()
{
	// This routine gets called every time a new frame happens.

	//	Some utility code in case you want to make animations:
	const max_dt = 50;
	var now = Date.now();
	var dt = now - g_last_frame_t;
	g_last_frame_t = now;
	gdT = Math.min(dt,max_dt); // Call the callback function, give it the time delta.
	gT += gdT;
	$("#time").text(gT);
	$("#fps").text((1000/dt).toFixed(1));

	// Execute your code
	Draw();


	if(gContinuousRedraw) requestAnimationFrame(AnimationFrame);  // Ask the browser to call this function again when it's ready for another frame.
	// If you set gContinuousRedraw to false, it will stop doing this (which will save energy on your computer, but the display won't update unless you call AnimationFrame() manually)
}


function Draw()
{

	// Here's where you will draw things!
	Clear(); // Clear the viewport; code below.

	// Note that in this projection, x is RIGHT, y is DOWN (not up!) 
	// DrawBox(0,0, gBoxSize, -Math.PI/180*0.1*gT);
	// DrawBox(0,0, gBoxSize, -Math.PI/180*(0.1*gT+180));

	screen_distance = 400*gBoxSize/100;
	eye_distance = 800*gBoxSize/100;

	DrawCube(100);
	if(gMyCheckbox) DrawBox(-100,-100,gBoxSize/2);
}


function Clear()
{
	// Clears the viewport.
	ctx.fillStyle="white"; 
	ctx.fillRect(-gWidth/2, -gHeight/2, gWidth, gHeight);  // from xy to deltax, deltay
}


var screen_distance = 400;
var eye_distance = 800;
function Project(p)
{

  // return the  x-y coordinates for a 3-vector
  var xy = vec2(0,0);
  xy[0] = p.x()/(p.z()+eye_distance)*screen_distance;
  xy[1] = p.y()/(p.z()+eye_distance)*screen_distance;
  return xy;
}

function MoveTo3d(p)
{
	var x = p.x()/(p.z()+eye_distance)*screen_distance;
  	var y = p.y()/(p.z()+eye_distance)*screen_distance;
	ctx.moveTo(x,y);
}
function LineTo3d(p)
{
	var x = p.x()/(p.z()+eye_distance)*screen_distance;
  	var y = p.y()/(p.z()+eye_distance)*screen_distance;
	ctx.lineTo(x,y);
}

function DrawCube(a)
{
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;

	// a is the half-width of the cube
	var p1 = vec3(-a,-a,-a);           
	var p2 = vec3(-a,+a,-a);           
	var p3 = vec3(+a,+a,-a);           
	var p4 = vec3(+a,-a,-a);           
	var p5 = vec3(-a,-a,+a);           
	var p6 = vec3(-a,+a,+a);           
	var p7 = vec3(+a,+a,+a);           
	var p8 = vec3(+a,-a,+a);           
	
	ctx.beginPath();
	MoveTo3d(p1);
	LineTo3d(p2);
	LineTo3d(p3);
	LineTo3d(p4);
	LineTo3d(p1);
	MoveTo3d(p5);
	LineTo3d(p6);
	LineTo3d(p7);
	LineTo3d(p8);
	LineTo3d(p5);

	MoveTo3d(p1); LineTo3d(p5);
	MoveTo3d(p2); LineTo3d(p6);
	MoveTo3d(p3); LineTo3d(p7);
	MoveTo3d(p4); LineTo3d(p8);
	ctx.stroke();

	
// 	ctx.beginPath();
// 	  ctx.moveTo(xy1.x(),xy1.y());
// 	  ctx.lineTo(xy2.x(),xy2.y());
// 	  ctx.lineTo(xy3.x(),xy3.y());
// 	  ctx.lineTo(xy4.x(),xy4.y());
// 	  ctx.lineTo(xy1.x(),xy1.y());
// 	  ctx.moveTo(xy5.x(),xy5.y());
// 	  ctx.lineTo(xy6.x(),xy6.y());
// 	  ctx.lineTo(xy7.x(),xy7.y());
// 	  ctx.lineTo(xy8.x(),xy8.y());
// 	  ctx.lineTo(xy5.x(),xy5.y());
// // /
// 	  ctx.moveTo(xy1.x(),xy1.y());
// 	  ctx.lineTo(xy5.x(),xy5.y());
// 	  ctx.moveTo(xy2.x(),xy2.y());
// 	  ctx.lineTo(xy6.x(),xy6.y());
// 	  ctx.moveTo(xy3.x(),xy3.y());
// 	  ctx.lineTo(xy7.x(),xy7.y());
// 	  ctx.moveTo(xy4.x(),xy4.y());
// 	  ctx.lineTo(xy8.x(),xy8.y());

// 	ctx.stroke();
}


function DrawBox(x,y,size,theta)
{
	// Sample code to show some simple draw commands in 2d
	ctx.strokeStyle = "red";  
	ctx.lineWidth = 2;  // thickish lines

	var x1 = x;
	var y1 = y;

	var x2 = x1+size;
	var y2 = y1;

	var x3 = x1+size;
	var y3 = y1+size;

	var x4 = x1;
	var y4 = y1+size;

	x1p = x1*Math.cos(theta) + y1*Math.sin(theta);
	y1p =-x1*Math.sin(theta) + y1*Math.cos(theta);

	x2p = x2*Math.cos(theta) + y2*Math.sin(theta);
	y2p =-x2*Math.sin(theta) + y2*Math.cos(theta)

	x3p = x3*Math.cos(theta) + y3*Math.sin(theta);
	y3p =-x3*Math.sin(theta) + y3*Math.cos(theta);

	x4p = x4*Math.cos(theta) + y4*Math.sin(theta);
	y4p =-x4*Math.sin(theta) + y4*Math.cos(theta);

	var rot = mat2([Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]);
	var p1 = vec2(x,y);
	var p2 = vec2(x+size,y);
	var p3 = vec2(x+size,y+size);
	var p4 = vec2(x,y+size);

	var p1r = rot.mult(p1);
	var p2r = rot.mult(p2);
	var p3r = rot.mult(p3);
	var p4r = rot.mult(p4);

	console.log("box",p1,p2,p3,p4);
	ctx.beginPath();  // We want to draw a line.
	ctx.moveTo(p1r.x(),p1r.y());  // start at a corner upper left hand cornner
	ctx.lineTo(p2r.x(),p2r.y());  // draw a line to the right
	ctx.lineTo(p3r.x(),p3r.y()); //  draw a line down
	ctx.lineTo(p4r.x(),p4r.y()); // draw a line left
	ctx.lineTo(p1r.x(),p1r.y());       // Draw a line up and back to the start corner
	ctx.stroke(); // actually draw the line on the screen as a red line of thickness 2



	// FIRST EXERCISE:
	// Modify the coordinates above so that they are rotated by 15 degrees to draw the box
	// ctx.beginPath();  // We want to draw a line.
	// ctx.moveTo(x1p,y1p);  // start at a corner upper left hand cornner
	// ctx.lineTo(x2p,y2p);  // draw a line to the right
	// ctx.lineTo(x3p,y3p); //  draw a line down
	// ctx.lineTo(x4p,y4p); // draw a line left
	// ctx.lineTo(x1p,y1p);       // Draw a line up and back to the start corner
	// ctx.stroke(); // actually draw the line on the screen as a red line of thickness 2

	// ctx.beginPath();  // We want to draw a line.
	// ctx.moveTo(x1,y1);  // start at a corner upper left hand cornner
	// ctx.lineTo(x2,y2);  // draw a line to the right
	// ctx.lineTo(x3,y3); //  draw a line down
	// ctx.lineTo(x4,y4); // draw a line left
	// ctx.lineTo(x1,y1);       // Draw a line up and back to the start corner
	// ctx.stroke(); // actually draw the line on the screen as a red line of thickness 2

	// This code fills the box green if ctl2 is being held down with the mouse.
	ctx.fillStyle = "green";
	if(gCtl2) ctx.fill();
}



function DummyExample()
{
	// Note two different libraries in use:
	// Math.sin(x)     --> buildin javascript Math library, capital M
	// math.matrix(3)  --> our 'math' library

	// This code shows how to use matrices
	var I = identity3(); // Creates a 3x3 identity matrix

	// Create a 3x3 rotation matrix that rotates about the z-axis by an angle of 45 degrees:
	var theta = Math.PI/4;  // computers use radians!
	var R = mat3(       [ Math.cos(theta),  -Math.sin(theta), 0 ],
						[ Math.sin(theta),   Math.cos(theta), 0 ],
						[ 0              ,   0              , 1 ]
						);

	console.log("R=",R);
	// make a column vector
	var v = vec3(2,2,5); // 2i + 3j + 5k

	// multiple I x R x v
	var v_rotated = R.mult(v);



	console.log("Dummy Example",v,v_rotated);
	console.log("R",R);
	console.log("identity",I.mult(R));
	console.log("identity",R.mult(I));
}
