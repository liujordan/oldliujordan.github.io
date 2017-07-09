var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
ctx.translate(width/2,height/2);	//centered origin

// var nodes = [[x1,y1,z1],[x2,y2,z2]]
// var edges = [[node1,node2],[node2,node3]]

//starting shape (cube)
var nodes = [
	[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
	[1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]];
var edges = [
	[0, 1],[1, 3], [3, 2], [2, 0], 
	[4, 5], [5, 7], [7, 6],[6, 4], 
	[0, 4], [1, 5], [2, 6], [3, 7]];
//rotation velocity
var vel = {
	x: 0,
	y: 0
};
//scale distance between vertices
function scale(s) {
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		node[0] *= s;
		node[1] *= s;
		node[2] *= s;
	}
}

function rotateShape(angleX, angleY) {
	sinX = Math.sin(angleX);
	cosX = Math.cos(angleX);

	sinY = Math.sin(angleY);
	cosY = Math.cos(angleY);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var x = node[0]; var y = node[1]; var z = node[2];

		node[0] = x * cosX - z * sinX;
		node[2] = z * cosX + x * sinX;

		z = node[2];

		node[1] = y * cosY - z * sinY;
		node[2] = z * cosY + y * sinY;
	}
}

function drawShape() {
	ctx.fillStyle = "black";
	for (var i = 0; i < edges.length; i++) {
		var edge = edges[i];
		var xy1 = nodes[edge[0]];
		var xy2 = nodes[edge[1]];
		drawLine(xy1[0], xy1[1], xy2[0], xy2[1]);
	}

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		ctx.fillRect(node[0]-4, node[1]-4, 8, 8);
	}
}

function clamp(x, max, min) {
	if (x > max) {
		x = max;
	} else if (x < min) {
		x = min;
	}
	return x;
}



function update(deltaTime) {
	//slowdown factor
	var friction = 0.95;
	var dx = Math.round(mouse.x - mouse.oldx);
	var dy = Math.round(mouse.y - mouse.oldy);
	//drag velocity
	if (mouse.down) {
		vel.x = dx/deltaTime*0.4;
		vel.y = dy/deltaTime*0.4;
	}
	vel.x *= friction;
	vel.y *= friction;
	clamp(vel.x, 1, 0); //max speed 1, min 0
	clamp(vel.y, 1, 0);

	rotateShape(vel.x, vel.y);
}

function draw() {
	ctx.translate(-width/2, -height/2);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.translate(width/2, height/2);
	drawShape();
}

//game loop
function loop(newTime) {
	var deltaTime = newTime - oldTime;

	update(deltaTime);
	draw();

	oldTime = newTime;
	window.requestAnimationFrame(loop);
}

function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function setShape(name) {
	if (name == "cube") {
		nodes = [
			[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
			[1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]];
		edges = [
			[0, 1],[1, 3], [3, 2], [2, 0], 
			[4, 5], [5, 7], [7, 6],[6, 4], 
			[0, 4], [1, 5], [2, 6], [3, 7]];
		scale(100);
		rotateShape(Math.PI / 4, Math.atan(Math.sqrt(2)));
	}
	if (name == "octahedron") { 
		nodes = [
			[-1, -1,  0],[-1,  1,  0],[ 1,  1,  0],
			[ 1, -1,  0],[ 0,  0,  2],[ 0,  0, -2]];
		edges = [
			[0, 1],[1, 2],[2, 3],[3, 0],
			[0, 4],[1, 4],[2, 4],[3, 4],
			[0, 5],[1, 5],[2, 5],[3, 5]];
		scale(100);
		rotateShape(Math.PI / 4, Math.atan(Math.sqrt(2)));
	}
}

//event listeners
var mouse = {
	x: 0,
	y: 0,
	oldx: 0,
	oldy: 0,
	down: false
}

function mousedown(event) {
	mouse.down = true;
}

function mouseup(event) {
	mouse.down = false;
}

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	mouse.oldx = mouse.x;
	mouse.oldy = mouse.y;
	mouse.x = evt.clientX - rect.left;
	mouse.y = evt.clientY - rect.top;
}
window.addEventListener("mousedown", mousedown, false);
window.addEventListener("mouseup", mouseup, false);
window.addEventListener("mousemove", getMousePos, false);

//begin animation
var oldTime = 0;
scale(100);
rotateShape(Math.PI / 4, Math.atan(Math.sqrt(2)));

window.requestAnimationFrame(loop);
