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
	gMyCheckbox = $("#changeit").val()
	$("#changeit").change(function(){
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
	// AnimationFrame();



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
	DrawBox(50,50, gBoxSize);
}

function Clear()
{
	// Clears the viewport.
	ctx.fillStyle="white"; 
	ctx.fillRect(0,0,gWidth,gHeight);
}

function DrawBox(x,y,size)
{
	// Sample code to show some simple draw commands in 2d
	ctx.strokeStyle = "red";  
	ctx.lineWidth = 2;  // thickish lines

	ctx.beginPath();  // We want to draw a line.
	ctx.moveTo(x,y);  // start at a corner
	ctx.lineTo(x+size,y);  // draw a line to the second corner
	ctx.lineTo(x+size,y+size);
	ctx.lineTo(x,y+size);
	ctx.lineTo(x,y);       // Draw a line back to the start corner
	ctx.stroke(); // Draw the line

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
