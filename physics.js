////////////////////////////////////////////////////////////////
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  // your code here
  propeller = Bodies.rectangle(150, 480, 200, 15, {
      isStatic: true, angle: angle
  });
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  // your code here
  fill(255,0,0);
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds(){
  push();
  //your code here
  //start from the end of the array for splicing
  for(var i=birds.length-1; i>=0; i--){
      drawVertices(birds[i].vertices);
      //checkBirdOffScreen
      if(isOffScreen(birds[i])){
          removeFromWorld(birds[i]);
          birds.splice(i,1);
//          console.log(birds.length);
      }
  }
  pop();
}

////////////////////////////////////////////////////////////////
function setupBigBird(){ //additional heavy bird
  var bigBird = Bodies.circle(mouseX, mouseY, 50, {friction: 1,
      restitution: 0.5 });
  Matter.Body.setMass(bigBird, bigBird.mass*50);
  World.add(engine.world, [bigBird]);
  bigBirds.push(bigBird);
}
////////////////////////////////////////////////////////////////
function drawBigBirds(){
  push();
  fill(200,0,0);
  //your code here
  //start from the end of the array for splicing
  for(var i=bigBirds.length-1; i>=0; i--){
      drawVertices(bigBirds[i].vertices);
      //checkBirdOffScreen
      if(isOffScreen(bigBirds[i])){
          removeFromWorld(bigBirds[i]);
          bigBirds.splice(i,1);
//          console.log(bigBirds.length);
      }
  }
  pop();
}

////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
  //you code here
  
  boxes = Composites.stack(650, 100, 3, 6, 0, 0, function(x, y) {
    return Bodies.rectangle(x, y, 80, 80, {
        render: {
          fillStyle: color(0,random(40,200),0)
        }
    });
  });
  World.add(engine.world, [boxes]);
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  //your code here
  for(var i=0; i<boxes.bodies.length; i++){
      fill(boxes.bodies[i].render.fillStyle);
      drawVertices(boxes.bodies[i].vertices);
  }
  pop();
  checkTowerOffScreen();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
//your code here
//  slingshotBird = Bodies.circle(180, 180, 20, {friction: 0, restitution:0.95, mass: 10});
  slingshotBird = Bodies.circle(180, 180, 20);
  slingshotBird.friction = 0;
  slingshotBird.restitution = 0.95;
  Matter.Body.setMass(slingshotBird, slingshotBird.mass*10);
    
//setup slingshotConstraint
  slingshotConstraint = Constraint.create({
      pointA: {x: 180, y: 150},
      bodyB: slingshotBird,
      pointB: {x: 0, y: 0},
      stiffness: 0.01,
      damping: 0.0001
  });
  World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  fill(255,255,0);
  drawVertices(slingshotBird.vertices);
  pop();
    
  push();
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}

function checkTowerOffScreen(){
    for(var i=boxes.bodies.length-1; i>=0; i--){
      if(isOffScreen(boxes.bodies[i])){
          Composite.remove(boxes, boxes.bodies[i]);
//          console.log(boxes.bodies.length);
      }
    }
}
