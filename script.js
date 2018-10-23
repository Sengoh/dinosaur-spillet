var myGamePiece;
//var hekker;
var myObstacles = [];

var score = 0

function startGame() {
    //myGamePiece = new component(30, 30, "stein.png", 20, 250, "image");
    myGamePiece = new component(30, 30, "red", 20, 250);
    //myObstacles = new component(30, 60, "black", 120, 210);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    stop : function() {
        console.log("dsbisdbintervsdfisdfsdhsd")
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


  var crouched = false;
  document.addEventListener("keydown", function(event) {
  event.preventDefault()
  if(event.keyCode == 38 ) {

    myGamePiece.jump()
    //hoppfunk
  }
  if(event.keyCode == 40 ) {
    crouched = true;
    myGamePiece.crouch(crouched)
  }

})
document.addEventListener("keyup", function(event) {
if(event.keyCode == 40 ) {
  crouched = false;
  myGamePiece.crouch(crouched)
}

})

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }

    this.gravity = 0.25;
    this.gravitySpeed = 0;
    this.bounce = 0;
    this.update = function() {
        ctx = myGameArea.context;
        text = myGameArea.context;
        if(type == "image") {
          ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        welcomeText();

        text.font = "18px Arial";
        text.fillStyle = "red"
        text.fillText("Score: " + score, 340, 35)
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(this.y < 200){
          this.gravity = 0.75
        }
        this.hitBottom();
    }
    this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
       if (this.y > rockbottom) {
           this.y = rockbottom;
this.gravitySpeed = -(this.gravitySpeed * this.bounce);
  }
}
    this.jump = function() {
        console.log(this.y)
        // this.gravity = -0.25
        if(this.y >= 240) {
          this.gravity = -2.5
        }
        this.height = 30;
    }


    this.crouch = function(crouched) {
      console.log(this.y)
      if(crouched) {
        if(this.y == 240) {
          if(this.type == "image") {
              this.image.src = "stein_crouch.png";
          }
          this.height = 15;
          this.y = this.y+15;
        }
      } else if (crouched == false) {
        this.height = 30;
        if(this.type == "image") {
            this.image.src = "stein.png";
        }
      }
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x; // figur venstre
      var myright = this.x + (this.width); //figur høyre
      var mytop = this.y + (this.height); // figur topp
      var mybottom = this.y; // figur bunn
      var otherleft = otherobj.x; // obstacle  venstre
      var otherright = otherobj.x + (otherobj.width); // obstacle høyre
      var othertop = otherobj.y + (otherobj.height); // obstacle topp
      var otherbottom = otherobj.y; // obstacle bunn
      var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
      //return crash;
    }
}

function updateGameArea() {
    var lastTry = true;
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();

    for (let i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x -= 3;
      myObstacles[i].update();
      if(myObstacles[i].x < myGamePiece.x+1.75 && myObstacles[i].x > myGamePiece.x-1.75) {

        setTimeout(function(){
          lastTry = true
        },3000)
        if (lastTry == true){
          score += 25;
          lastTry = false
        }


      }
    }
    for (let i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        myGameArea.stop();
        console.log("wat");
        return;
      }
    }
}

var spawnRate = 1000;
setInterval(randomTimer, 1000)
function randomTimer(){
spawnRate = (Math.floor(Math.random() * 5) + 3)*1000;
window.setTimeout(spawnObstacle, spawnRate)
}

function spawnObstacle() {
//console.log(spawnRate);
minWidth = 10;
maxWidth = 60;
minHeight = 60;
maxHeight = 90;

var chosenValue = Math.random() < 0.5 ? 0 : 20;

myObstacles.push(
new component(
  20,
  -(Math.random() * maxHeight + minHeight),
  "blue",
  480,
  270 - (chosenValue)
)
)
}
var textX = 100;
function welcomeText() {
y = 50;
textX -= 1;
text.font = "30px Arial";
text.fillStyle = "red";
text.fillText("Stein JUMPer",textX,50);
}
