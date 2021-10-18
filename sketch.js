// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Composites = Matter.Composites;
var Composite = Matter.Composite;

var engine;
var propeller;
var boxes = [];
var birds = [];
var bigBirds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;
var startTime;
var time;
var timeTaken;
var timeLapsed;
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);
  startTime = new Date().getTime();
  engine = Engine.create();  // create an engine
  setupGround();
  setupPropeller();
  setupTower();
  setupSlingshot();
  setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);
  Engine.update(engine);
  drawGround();
  drawPropeller();
  drawTower();
  drawBirds();
  drawBigBirds();
  drawSlingshot();
  drawTimer();
  checkTowerOffScreen();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == LEFT_ARROW){
    //your code here
    angleSpeed += 0.01;
  }
  else if (keyCode == RIGHT_ARROW){
    //your code here
    angleSpeed -= 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){
  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }
    
  if (key==='g'){
    setupBigBird();
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}

function drawTimer(){
    time = new Date().getTime();
    timeTaken = time - startTime;
//    var timeLapsed = Math.floor(diff%(1000*60)/1000);
    timeLapsed = 60 - Math.floor(timeTaken/1000);
    textSize(20);
    text("Time left: " + timeLapsed + " sec", 20, 50);
    fill(255);
    console.log(timeLapsed);
    console.log("time taken " + timeTaken);
    checkGameState();
}

function checkGameState(){
    if(boxes.bodies.length == 0){
        winGame();
    }
    else if(timeLapsed == 0){
        if(boxes.bodies.length != 0){
            gameOver();
        }
    }
}

function gameOver(){
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2)
    noLoop();
}

function winGame(){
    textAlign(CENTER);
        push();
        fill(255);
        textSize(30);
        var time = "Time taken: " + (60-timeLapsed) + " secs";
        pop();
    fill(255);
    textSize(80);
    text("YOU WIN!\n" + time, width/2, height/2)
    noLoop();
}