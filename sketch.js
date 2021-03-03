//changable vars:
let CS=800; //size of the canvas (it may broke text probably idk)
let squareSize=130; //size of the tiles
let gapRatio = 20; //gaps between squares
let timePerShow=300; // ms
let N=3; // playable at 1 - 6 for defaults, but text is broken at > 3
let gameLength = 1; // you can change it but it will get back to 1;
//____________________________________________________________________
let nullCord;
let gap;
let gamestate=0;
let lastgamel;
function setup() {
  createCanvas(CS, CS);
  egg = new Egg(CS/2, CS/1.5, 5, 180);
  gap = squareSize/gapRatio;
  boardSize=squareSize*N+gap*(N-1);
  
  nullCord = CS/2 - boardSize/2;
}
let startTime;
let gameArray = [];
let iToCheck;
function startGame(){
  //gameArray.length = 0;
  //for (let i = 1;i<=gameLength;i++){
    newRand=int(random(1,N*N));
    if (gameLength > 1){
      if (gameArray[gameArray.length-1] == newRand){print("test");
        newRand = 1+(newRand + 1)%(N*N);
        
      }
    }
    gameArray.push(newRand);
 // }
  print(gameArray);
  gamestate=1;
  startTime=performance.now();
  iToCheck=0;
}
let currentTilePressed;
function draw() {
  background(0);
  
  
  if (gamestate == 1){
    text("Remember", CS/2, CS/6);
    
    let currentTime=performance.now()-startTime;
    if (currentTime>timePerShow*gameLength){
      gamestate=2;
    }else{
      let numIndex= int(currentTime/timePerShow);
      let nToShow = gameArray[numIndex];
      text((numIndex+1) + " of " + gameLength, CS/2, CS/9);
      for (let i = 1;i<=N*N;i++){
      let xcoord=nullCord+linToX(i)*(squareSize+gap);
      let ycoord=nullCord+linToY(i)*(squareSize+gap);
      if (nToShow==i){
      drawSquare(2,xcoord,ycoord);
      }else{
        drawSquare(-1,xcoord,ycoord);
      }
      }
    }
  }
  fill(255,255,255);
  textSize(30);
  textAlign(CENTER,CENTER);
  if(gamestate == 0){
  text("Current Showing time per tile (+/-): "+ timePerShow, CS/2, CS/10);
  text("Egg to start the game", CS/2, CS/5);
  text("Tiles to remember: " + gameLength, CS/2, CS/1.1);
    
    egg.wobble();
    egg.display();
    
  }

  if (gamestate==2){
  text("Repeat", CS/2, CS/5);
    
  for (let i = 1;i<=N*N;i++){
    let xcoord=nullCord+linToX(i)*(squareSize+gap);
    let ycoord=nullCord+linToY(i)*(squareSize+gap);
    if(inRect(mouseX,mouseY,xcoord,ycoord,squareSize,squareSize)){
      if (mouseIsPressed){
        drawSquare(0,xcoord,ycoord);
      }else{
        drawSquare(1,xcoord,ycoord);
      }
    }else{
      drawSquare(-1,xcoord,ycoord);
    }
  }
  }
  if (gamestate==3){text("You won!", CS/2, CS/5);egg.wobble();
    egg.display();
                    text("Tiles to remember next time: " + gameLength, CS/2, CS/1.1);
                   }
    if (gamestate==4){text("You lose! No egg for you", CS/2, CS/5);
                      text("Last score: " + lastgamel, CS/2, CS/2)
                      
                      
                   }
}

function mousePressed(){
  if (gamestate == 0){
    startGame();
  }
  if (gamestate ==3){
    startGame();
  }
  if (gamestate == 4){
    gamestate = 0;
  }
  if (gamestate==2){
    if (inRect(mouseX,mouseY,nullCord,nullCord,boardSize,boardSize)){
      for (let i = 1;i<=N*N;i++){
      let xcoord=nullCord+linToX(i)*(squareSize+gap);
      let ycoord=nullCord+linToY(i)*(squareSize+gap);
      if(inRect(mouseX,mouseY,xcoord,ycoord,squareSize,squareSize)){
        currentTilePressed = i;
      if (currentTilePressed == gameArray[iToCheck]){
        iToCheck++;
      if (iToCheck==gameLength){
        gamestate=3;
        gameLength++;
      }
      }else{
        gamestate=4;
        gameArray.length = 0;
        lastgamel=gameLength;
        gameLength=1;
      }
  }}
    }
    }

}

function keyPressed(){
  if (gamestate == 0){
  if (key === '+' || key === '='){
    if (timePerShow<5000){
    timePerShow=timePerShow+50;}
  }
  if (key === '-'){
    if (timePerShow>50){
    timePerShow=timePerShow-50;}
  }
  }
}
function inRect(x,y, rx, ry, w, h){
  let mNormX = x-rx;
  let mNormY = y-ry;
  return (mNormX >= 0 && mNormY >= 0 && 
        mNormX <= w && mNormY <= h)
}

//X Y coords to lin (0..4) (0..4) to 1..N^2
function XYtolin(X, Y)
{
  return Y*N + X + 1;
}

//lineral coordinats to X (1..N^2) to (0..4)
function linToX(lin){
  return (lin-1) % N;
}

//lineral coordinats to Y (1..N^2) to (0..4)
function linToY(lin){
  return int(floor((lin-1) / N));
}


function drawSquare(col, x, y){
  if (col == 0){
    fill(250,150,200);
  }
  else{
  if (col == 1){
     fill(250,150,150);
  }
  else{
      if (col == 2){
     fill(150,150,250);
  }else{
    fill(255,255,255);
  }}
  }
  rect(x,y,squareSize,squareSize)
}

class Egg {
  constructor(xpos, ypos, t, s) {
    this.x = xpos;
    this.y = ypos;
    this.tilt = t;
    this.scalar = s / 100.0;
    this.angle = 0.0;
  }

  wobble() {
    this.tilt = cos(this.angle) / 8;
    this.angle += 0.1;
  }

  display() {
    noStroke();
    fill(255);
    push();
    translate(this.x, this.y);
    rotate(this.tilt);
    scale(this.scalar);
    beginShape();
    vertex(0, -100);
    bezierVertex(25, -100, 40, -65, 40, -40);
    bezierVertex(40, -15, 25, 0, 0, 0);
    bezierVertex(-25, 0, -40, -15, -40, -40);
    bezierVertex(-40, -65, -25, -100, 0, -100);
    endShape();
    pop();
  }
}