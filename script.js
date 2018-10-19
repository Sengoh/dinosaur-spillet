var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 20, 150);
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
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

  document.addEventListener("keyup", function(event) {
  event.preventDefault()
  if(event.keyCode == 38 ) {

    myGamePiece.jump()
    //hoppfunk
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

    setInterval(sjekker, 10)
    function sjekker() {
        console.log();
    }

    this.gravity = 0.25;
    this.gravitySpeed = 0;
    this.bounce = 0.1;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(this.y < 200){
          this.gravity = 0.55
        }
        this.hitBottom();
    }
    this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
       if (this.y > rockbottom) {
           this.y = rockbottom;
           this.gravitySpeed = -(this.gravitySpeed * this.bounce);
  }

    this.jump = function() {
        console.log(this.y)
        // this.gravity = -0.25
        if(this.y == 240) {
          this.gravity = -0.35
        }
      }

    }
}

/*for(let x =0; x<-100;x-=0.1){
this.gravity = -x
console.log("kjører")
}
this.gravity = 0.25;
x = 0
*/

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();

}
