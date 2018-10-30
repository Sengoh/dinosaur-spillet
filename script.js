var myGamePiece;
    var hekker;
    var myObstacles = [];
    //Variabler for score
    var score = 0
    var highscore = 0
    var poengMultiplier = 1;
    //Variabler for tilbakemelding ved powerup
    var spook = false
    var powerMelding = "";
    var paused = false;
    var imageSrc = "https://raw.githubusercontent.com/Sengoh/dinosaur-spillet/master/bilder/";
    // Starter spillet, definerer objekter
    function startGame() {
        myGamePiece = new component(60, 60, imageSrc + "steinbilkvadrat.png?token=AqNcsw7jrF4SvivyE77QEN8cojOZR3Ioks5b2aXFwA%3D%3D", 40, 500, "image");
        //mySpookelse = new component(60,60, imageSrc + "ghost.png?token=AFEP5X8-nfBR0jZWWM6v62wnL6iJSluhks5b2aHPwA%3D%3D", 960, 200, "image");
        //myGamePiece = new component(30, 30, "red", 20, 250);
        //myObstacles = new component(30, 60, "black", 120, 210);
        myGameArea.start();
    }
    // Spillområdet
    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 960;
            this.canvas.height = 540;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20);
        },
        stop : function() {
            console.log("Stopp")
            clearInterval(this.interval);
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    var checkCollision = true;
    /*var myPowerUps = [
      {
      spOOkelse : function() {
        console.log("test");
        checkCollision = false;
        setTimeout(function() {
          checkCollision = true;
        }, 5000);
      }
    },
    {
      reeee: "reee"
    }
  ];*/
  var myPowerUps = [
    [
    //Spookelse
    function() {
      console.log("Spookelse kjører");
      checkCollision = false;
      setTimeout(function() {
        checkCollision = true;
      }, 5000);
    },
    //Poengrutsj
    function() {
      console.log("Dobbelt poeng kjører");
      poengMultiplier = 2;
      setTimeout(function() {
        poengMultiplier = 1;
      }, 5000);
    },
    //Gullmynt
    function() {
      console.log("500 poeng gis");
      score += 500
    }
  ],
  [
    imageSrc + "ghost.png?token=AFEP5X8-nfBR0jZWWM6v62wnL6iJSluhks5b2aHPwA%3D%3D",
    imageSrc + "x2.png?token=AFEP5U_OxMht9Dfde1oMRD6ynXg6W9yWks5b4Z9WwA%3D%3D",
    imageSrc + "coin.png?token=AFEP5WjWPri6tyfpuMX1cDFuVWEGY1eDks5b4ZSJwA%3D%3D"
  ]
];
  var mySpawnedPowerUps = [];
      var crouched = false;
      document.addEventListener("keydown", function(event) {
      event.preventDefault()
      if(event.keyCode == 38 ) {
        //hoppfunk
        myGamePiece.jump()
      }
      if(event.keyCode == 40 ) {
        crouched = true;
        //dukkfunk
        myGamePiece.crouch(crouched)
      }
    })
    document.addEventListener("keyup", function(event) {
    if(event.keyCode == 40 ) {
      crouched = false;
      myGamePiece.crouch(crouched)
    }
    if(event.keyCode == 32) {
      myGameArea.stop()
      startGame()
      myObstacles = [];
      score = 0;
    }
      if(event.keyCode == 80) {
          if(paused == false) {
            myGameArea.stop()
            paused = true;
          } else {
            myGameArea.start();
            paused = false;
          }
      }
    })
    //Alle objekter i spillet
    function component(width, height, color, x, y, type, powerup) {
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
          this.image.opacity = 0.5;
        }
        this.powerup = powerup;
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
            text.font = "24px Arial";
            text.fillStyle = "red"
            text.fillText("Score: " + score, 680, 70)
            text.fillText("Highscore: " + highscore,680,95)
            if (spook == true) {
              text.font = "30px Arial";
              text.fillStyle = "red";
              text.fillText(powerMelding,200,200);
            }
        }
        this.newPos = function() {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            if(this.y < 400){
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
            if(this.type == "image") {
                this.image.src = imageSrc + "steinbilkvadrat.png?token=AqNcsw7jrF4SvivyE77QEN8cojOZR3Ioks5b2aXFwA%3D%3D";
            }
            if(this.y >= 480) {
              this.gravity = -2.5
            }
            this.height = 60;
        }
        this.crouch = function(crouched) {
          console.log(this.y)
          if(crouched) {
            if(this.y == 480) {
              if(this.type == "image") {
                  this.image.src = imageSrc + "steinbilcrouch2kvadrat.png?token=AqNcs5-htIKkqYkKhKD8kc1YBxYvKJA2ks5b2aXHwA%3D%3D";
              }
              this.height = 30;
              this.y = this.y+30;
            }
          } else if (crouched == false) {
            this.height = 60;
            if(this.type == "image") {
                this.image.src = imageSrc + "steinbilkvadrat.png?token=AqNcsw7jrF4SvivyE77QEN8cojOZR3Ioks5b2aXFwA%3D%3D";
            }
          }
        }
        this.crashWith = function(otherobj) {
          if(checkCollision) {
            var myleft = this.x; // figur venstre
            var myright = this.x + (this.width); //figur høyre
            var mytop = this.y; // figur topp
            var mybottom = this.y + (this.height); // figur bunn
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
        this.pickUp = function(otherobj) {
          if(checkCollision) {
            var myleft = this.x; // figur venstre
            var myright = this.x + (this.width); //figur høyre
            var mytop = this.y; // figur topp
            var mybottom = this.y + (this.height); // figur bunn
            var otherleft = otherobj.x; // obstacle  venstre
            var otherright = otherobj.x + (otherobj.width); // obstacle høyre
            var othertop = otherobj.y; // obstacle topp
            var otherbottom = otherobj.y +
            (otherobj.height);; // obstacle bunn
            var pickedup = true;
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
              pickedup = false;
            }
            //console.log(myright + ", " + otherleft);
            return pickedup;
            //return crash;
          }
        }
    }
    function updateGameArea() {
        var lastTry = true;
        myGameArea.clear();
        myGamePiece.newPos();
        myGamePiece.update();
        /*if(mySpookelse != "") {
          mySpookelse.update();
          mySpookelse.x -= 2;
          if (myGamePiece.pickUp(mySpookelse)) {
            if(myGamePiece.type == "image") {
              myGamePiece.image.style.opacity = 0.1;
              myGamePiece.image.src = imageSrc + "steinbilkvadratopacity1.png?token=AqNcs2a1uzqH23gIz5Sy-ggbxmqcaF6gks5b2ar0wA%3D%3D";
            }
            console.log(myGamePiece.image.style.opacity);
            myPowerUps[2]();
            spook = true
            setTimeout(spooking,5000)
            function spooking() {
              spook = false
            }
            mySpookelse = "";
          }
        }*/
        //console.log(myGamePiece.image.style.opacity);
        if(score > highscore) {
          highscore = score
        }
        for (let i = 0; i < myObstacles.length; i += 1) {
          myObstacles[i].x -= 6;
          myObstacles[i].update();
          if(myObstacles[i].x < -40) {
            myObstacles[i].x = -50;
            //delete myObstacles[i];
            //  myObstacles.splice(i,1);
            //console.log(myObstacles[2].x);
          }
          if(myObstacles[i].x < myGamePiece.x+3 && myObstacles[i].x > myGamePiece.x-3) {
            setTimeout(function(){
              lastTry = true
            },3000)
            if (lastTry == true){
              score += 25*poengMultiplier;
              lastTry = false
            }
          }
        }
        for (let i = 0; i < mySpawnedPowerUps.length; i += 1) {
          if(mySpawnedPowerUps[i] != 0) {
            mySpawnedPowerUps[i].x -= 2;
            mySpawnedPowerUps[i].update();
            if(mySpawnedPowerUps[i].x < -50) {
              mySpawnedPowerUps[i].x = -100;
            }
            if (myGamePiece.pickUp(mySpawnedPowerUps[i])) {
              console.log(myGamePiece.image.style.opacity);
              var currentPowerup = mySpawnedPowerUps[i].powerup;
              console.log(currentPowerup);
              myPowerUps[0][currentPowerup]();
              if(mySpawnedPowerUps[i].powerup == 0) {
                powerMelding = "Boo!";
              } else if(mySpawnedPowerUps[i].powerup == 1) {
                powerMelding = "x2 Poeng!";
              } else if(mySpawnedPowerUps[i].powerup == 2) {
                powerMelding = "500 BONUS!";
              }
              spook = true
              setTimeout(spooking,5000)
              function spooking() {
                spook = false
              }
              mySpawnedPowerUps[i] = "";
            }
          }
        }
        for (let i = 0; i < myObstacles.length; i += 1) {
          if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            console.log("Krasj");
            newHighscore()
            text.font = "30px Arial";
            text.fillStyle = "red";
            text.fillText("Du tapte!",200,200);
            text.font = "15px Arial";
            text.fillStyle = "red";
            text.fillText("Vil du prøve på nytt? Trykk på space",160,240);
            return;
          }
        }
        if(score >= 1000) {
          myGameArea.canvas.style.backgroundImage = "url(" +imageSrc + "level2.png?token=AFEP5a_I4MSb3AAi4RFJ_lzo4lZSmNeCks5b2a0nwA%3D%3D)";
        }
    }
    let spawnRate = 0;
    var startSpawn = setInterval(randomTimer, 1899)
    function randomTimer(){
    spawnRate = (Math.floor(Math.random() * (3.2 - 2.7) + 2.7))*1000;
    // spawnRate = (Math.random() * 3.3 + 2.2)*1000;
    let test = (Math.random() * (4.3-3.2)+3.2) * 1000
    // spawnRate = (Math.floor(Math.random() * (3)) + 3);
    console.log("Spawnrate "+spawnRate);
    console.log("testytest: "+test)
    window.setTimeout(spawnObstacle, test)
    }
    function spawnObstacle() {
    //console.log(spawnRate);
    minWidth = 20;
    maxWidth = 120;
    minHeight = 120;
    maxHeight = 160;
    var chosenValue = Math.random() < 0.5 ? 0 : 40;
    myObstacles.push(
    new component(
      20,
      -(Math.random() * maxHeight + minHeight) - chosenValue,
      "blue",
      960,
      540 - (chosenValue)
    )
    )
    }
    var startSpawn = setInterval(randomPowerup, 14899)
    function randomPowerup(){
    //spawnRate = (Math.floor(Math.random() * (3.2 - 2.7) + 2.7))*1000;
    // spawnRate = (Math.random() * 3.3 + 2.2)*1000;
    let test2 = (Math.random() * (15-10)+10) * 1000
    // spawnRate = (Math.floor(Math.random() * (3)) + 3);
    console.log("Spawnrate "+spawnRate);
    console.log("testytest: "+test2)
    window.setTimeout(spawnPowerup, test2)
    }
    //spawnPowerup();
    function spawnPowerup() {
    console.log("eyy");
    var powerup = Math.floor(Math.random()*myPowerUps[0].length);
    console.log(powerup);
      mySpawnedPowerUps.push(
        new component(60,60, myPowerUps[1][powerup], 960, 200, "image", powerup)
      );
    }
    var textX = 200;
    function welcomeText() {
    y = 50;
    textX -= 1;
    text.font = "30px Arial";
    text.fillStyle = "red";
    text.fillText("Stein JUMPer",textX,100);
    }
    function newHighscore(){
      if (score >= highscore && score != 0) {
        // var input = document.createElement("input");
        // var btn = document.createElement("button");
        // var btntxt = document.createTextNode("Send inn din highscore!");
        // var name = prompt("Gratulerer! Du har fått en ny highscore! Skriv inn ditt navn:", "Navn")
        // btn.appendChild(btntxt);
        // document.body.appendChild(input);
        // document.body.appendChild(btn)
        // input.setAttribute("type", "text")
        // input.setAttribute("autofocus", "")
        // btn.addEventListener('click', saveInput)
        //
        // function saveInput(){
        //   console.log("Button clicked")
        //   scoreTracker.name.push(input.value)
        //   scoreTracker.score.push(score)
        //   console.log(scoreTracker.name, scoreTracker.score)
        //   var scoreinput = document.getElementById("scoreInput");
          var text = name + ", med score " + score + "!<br />";
          document.getElementById("scoreInput").innerHTML += text
        //   input.remove(0)
        //   btn.remove(0)
        // }
      }
    }
