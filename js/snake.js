//		Made by Rhett Thompson. ©2019 Rhett Thompson
//		V 1.0


//---------------------Canvas Setup---------------------
var canvas = document.getElementById('bg');
var draw2D = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.focus();


// ------------------System Functions-----------------
function drawBox(x, y, size){
	draw2D.beginPath();
	draw2D.rect(x, y, size, size);
	draw2D.fillStyle = 'rgb(255,255,255)'; //color;
	draw2D.fill();
	draw2D.closePath();
}

function clearBg() {
	draw2D.beginPath();
	draw2D.rect(0, 0, canvas.width, canvas.height);

	draw2D.fillStyle = 'rgb(0,0,0)';

	draw2D.fill();
	draw2D.closePath();
}


// ----------------Game functions--------------------------
var direction = 0; //0=up, 1=down, 2=right, 3=left

var snake = [];
//Snake's head will start in the center of the screen...
snake.push( {x:canvas.width/2, y:canvas.height/2} );
snake.push( {x:-10, y:-10} );
snake.push( {x:-10, y:-10} );

//Randomly Place the first food...
var food = {};
food.x = randomRange(0, canvas.width-10); //"-10" so the food does not spawn in the wall!
food.y = randomRange(0, canvas.height-10);

var moveTimer = 0;
var moveTimerMax = 100; //100;

var lastTimestamp = Date.now();
var deltaTime; //dt in milliseconds.

function update (){
	//Update Delta Time...
	deltaTime =  Date.now() - lastTimestamp;
	lastTimestamp = Date.now();
	
	//-------------------------Game Update Code-------------------------
	moveTimer += deltaTime;
	if (moveTimer > moveTimerMax){
		
		//Step through the snake's array in reverse shifting it down. This will update every part of the snake except the head. That is updated in the code below... Its important to update the head after the body, so the head and the first block of the body aren't in the position!
		for(var i=snake.length-1; i > 0; i--){
			snake[i].x = snake[i-1].x;
			snake[i].y = snake[i-1].y;
		}
		
		if (direction == 0){
			snake[0].y -= 10; //Y axis is flipped
		} else if (direction == 1) {
			snake[0].y += 10;
		} else if (direction == 2) {
			snake[0].x += 10;
		} else if (direction == 3) {
			snake[0].x -= 10;
		}

		//Reset the move timer...
		moveTimer = 0;
	}

	checkCollision();
	
	//---------------------------------------Render the canvas---------------------------------------
	//Clear the last frame from the canvas.
	clearBg();
	
	//DrawFood, round its position to the grid first...
	food.x = roundToGrid(food.x);
	food.y = roundToGrid(food.y);
	drawBox(food.x, food.y, 10);

	//Draw the snake, round its position to the grid first..
	for(var i=0; i < snake.length; i++){
		snake[i].x = roundToGrid(snake[i].x);
		snake[i].y = roundToGrid(snake[i].y);
		drawBox(snake[i].x, snake[i].y, 10);
	}

	// Setup recursion for the update function by calling it in the "requestAnimationFrame".
	window.requestAnimationFrame(update);
}
// Call the animation frame, start the recursion...
window.requestAnimationFrame(update);



function checkCollision () {
	//Snake Collisions
	for(var i=1; i < snake.length; i++){ //Start at "i=1" so you don't check the snake's head against itself!
		//If the snake's head hit any part of its body Game Over...
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
			restart();
			break; //Escape from the collision loop because we just reset the game. If we don't, we'd get an error...
		}
		
		//If the food spawns inside the snake's tail, move it!
		if(food.x == snake[i].x && food.y == snake[i].y){
			food.x = randomRange(0, canvas.width-10);
			food.y = randomRange(0, canvas.height-10);
		}
	}
	
	//Wall Collisions
	if (snake[0].x < 0 || snake[0].y < 0){
		restart();
	}

	if (snake[0].x >= canvas.width || snake[0].y >= canvas.height){
		restart();
	}
	
	//Food Collision
	if(snake[0].x == food.x && snake[0].y == food.y) {
		
		//Grow the Snake! Note: It's okay to spawn the new tail at (0,0) because the movement update will fix that!
		snake.push( {x:-10, y:-10} ); //was (x:0,y:0)
		
		//Respawn food
		food.x = randomRange(0, canvas.width-10); //"-10" so the food does not spawn in the wall!
		food.y = randomRange(0, canvas.height-10);
	}
}



// --------------Input function------------------
window.addEventListener('keydown', function (key) {
	if(key.key == 'ArrowUp' && direction != 1 && direction != 0){ //Make sure we are not turning on to our first tail... Also, don't allow input in the direction that we are already moving!
		direction = 0;
		moveTimer += moveTimerMax; //This is a bit of a cheat to make the input feel super sharp!
	} else if(key.key == 'ArrowDown' && direction != 0 && direction != 1){
		direction = 1;
		moveTimer += moveTimerMax;
	} else if(key.key == 'ArrowRight' && direction != 3 && direction != 2){
		direction = 2;
		moveTimer += moveTimerMax;
	} else if(key.key == 'ArrowLeft' && direction != 2 && direction != 3){
		direction = 3;
		moveTimer += moveTimerMax;
	}
}, false);


//Handle Window Resize...
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//Restart the game inside of the new window size!
	restart();
}, false);

function restart() {
	snake = []; //Empty the snake array.
	snake.push( {x:canvas.width/2, y:canvas.height/2} ); //Fill it with the default.
	snake.push( {x:-10, y:-10} );
	snake.push( {x:-10, y:-10} );
	
	direction = 0;
	moveTimer = 0;
	
	food.x = randomRange(0, canvas.width-10); //Reset food.
	food.y = randomRange(0, canvas.height-10);
}

//Round to a ten pixel grid...
function roundToGrid(numb) {
	return Math.round(numb/10) * 10;
}

//Random between two numbers function...
function randomRange(min, max){
	return Math.random() * (max - min) + min;
}
