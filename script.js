//Variabler
    var myGamePiece;
    var hekker;
    var myObstacles = [];
    //Variabler for score
    var score = 0
    var highscore = 0
    var poengMultiplier = 1;
    //Variabler for tilbakemelding ved powerup
    var spook = false
    var dobbel = false
    var powerMelding = "";
    var paused = false;
    var checkCollision = true;
    var gameRunning = true
    var imageSrc = "https://raw.githubusercontent.com/Sengoh/dinosaur-spillet/master/bilder/";
    // Starter spillet, definerer objekter
    function startGame() {
        myGamePiece = new component(60, 60, "bilder/steinbilkvadrat.png", 40, 500, "image");
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
            gameRunning = false;
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

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
      poengMultiplier = 20;
      setTimeout(function() {
        poengMultiplier = 1;
      }, 10000);
    },
    //Gullmynt
    function() {
      console.log("500 poeng gis");
      score += 1000
    },
    //Olsø
    function() {
      console.log("250 poeng tas")
      score -= 250
    }
  ],
  [
    "bilder/ghost.png",
    "bilder/x2.png",
    "bilder/coin.png",
    "bilder/tyv.png"
  ]
];
  var mySpawnedPowerUps = [];
      var crouched = false;
      //Registrerer om brukeren trykker på opp eller ned
      document.addEventListener("keydown", function(event) {
        if (gameRunning || event.keyCode == 32) {
            event.preventDefault()
        }
      if(event.keyCode == 38 ) { //Piltast opp
        //hoppfunk
        myGamePiece.jump()
      }
      if(event.keyCode == 40 ) { //Piltast ned
        crouched = true;
        //dukkfunk
        myGamePiece.crouch(crouched)
      }
    })
    document.addEventListener("keyup", function(event) {
    if(event.keyCode == 40 ) { //Slipp piltast ned
      crouched = false;
      myGamePiece.crouch(crouched)
    }
    if(event.keyCode == 32) { //Spacebar, starter spillet på nytt
      myGameArea.stop()
      startGame();
      gameRunning = true;
      myObstacles = [];
      myTiles2 = [];
      tilesNr = 0;
      mySpawnedPowerUps = [];
      score = 0;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      myGameArea.canvas.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2018/03/19/13/04/cityscape-3239939_1280.png)";
    }
      if(event.keyCode == 80) { //P, setter spillet på pause
          if(paused == false) {
            myGameArea.stop()
            paused = true;
          } else {
            myGameArea.start();
            paused = false;
          }
      }
    })
    //Funksjon for å lage alle objekter i spillet, både steinbilen og obstacles
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
        this.gravity = 0.25; //
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
            welcomeText(); //Tekst som kommer når spillet starter
            text.font = "24px Arial";
            text.fillStyle = "red"
            text.fillText("Score: " + score, 680, 70)
            text.fillText("Highscore: " + highscore,680,95)
            if (spook == true || dobbel == true) {
              text.font = "30px Arial";
              text.fillStyle = "red";
              text.fillText(powerMelding,200,200); //Beskjed som kommer når spillfiguren plukker opp en powerup
            }
        }
        //Funksjon som bestemmer hvor høyt spillfiguren skal hoppe
        this.newPos = function() {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            if(this.y < 400){ //Når spillfiguren er ved denne y-høyden skal den falle
              this.gravity = 0.75
            }
            this.hitBottom();
        }
        //Funksjonen som bestemmer at spillfiguren skal stoppe å falle når den når bunnen
        this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
           if (this.y > rockbottom) {
               this.y = rockbottom;
    this.gravitySpeed = -(this.gravitySpeed * this.bounce);
      }
    }
        //Funksjonen som bestemmer at spillfiguren hopper
        this.jump = function() {
            console.log(this.y)
            if(this.type == "image") {
                this.image.src = "bilder/steinbilkvadrat.png";
            }
            if(this.y >= 480) {
              this.gravity = -2.5
            }
            this.height = 60;
        }
        //Funksjonen som bestemmer at spillfiguren dukker
        this.crouch = function(crouched) {
          console.log(this.y)
          if(crouched) {
            if(this.y == 480) {
              if(this.type == "image") {
                  this.image.src = "bilder/steinbilcrouch2kvadrat.png";
              }
              this.height = 30;
              this.y = this.y+30;
            }
          } else if (crouched == false) {
            this.height = 60;
            if(this.type == "image") {
                this.image.src = "bilder/steinbilkvadrat.png";
            }
          }
        }
        //Funksjonen som skjekker om spillfiguren krasjer med en obstacle.
        this.crashWith = function(otherobj) {
          if(checkCollision) {
            if(otherobj != "") {
              var myleft = this.x; // figur venstre
              var myright = this.x + (this.width); //figur høyre
              var mytop = this.y; // figur topp
              var mybottom = this.y + (this.height); // figur bunn
              var otherleft = otherobj.x; // obstacle  venstre
              var otherright = otherobj.x + (otherobj.width); // obstacle høyre
              var othertop = otherobj.y + (otherobj.height); // obstacle topp
              var otherbottom = otherobj.y; // obstacle bunn
              var crash = true;
              //Vi setter crash = true til default, hvis spillfiguren ikke berører en obstacle settes crash til false og spillet fortsetter
              if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false;
              }
              return crash;
             }
          }
        }
        //Funksjonen som skjekker om spillfiguren krasjer med en powerup
        this.pickUp = function(otherobj) {
          //if(checkCollision) {
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
            ///Vi setter pickedup = true til default, hvis spillfiguren ikke berører en obstacle setters pickedup til false og spillet fortsetter
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
              pickedup = false;
            }
            //console.log(myright + ", " + otherleft);
            return pickedup;
            //return crash;
        //  }
        }
    }
    //Funksjonen som oppdaterer canvasen
    function updateGameArea() {
        var lastTry = true;
        myGameArea.clear();
        myGamePiece.newPos();
        myGamePiece.update();
        //Forloop som stopper objectene da de går ut av canvasen slik at de ikke fortsetter i evigheten
        for (let i = 0; i < myObstacles.length; i += 1) {
          if(myObstacles[i] != "") {
            myObstacles[i].x -= 6;
            myObstacles[i].update();
            if(myObstacles[i].x < -40) {
              myObstacles[i] = "";
            }
          }
          //Gir brukeren poeng dersom spillfiguren har passert en obstacle
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
        for (let i = 0; i < myTiles2.length; i += 1) {
          for(let j = 0; j < myTiles2[i].length; j ++) {
            if(myTiles2[i][j] != "") {
              myTiles2[i][j].x -= 6;
              myTiles2[i][j].update();
              if(myTiles2[i][j].x < -40) {
                myTiles2[i][j] = "";
              }
            }
          }
        }
        //Opretter obstacles og sender dem mot spillfiguren
        for (let i = 0; i < mySpawnedPowerUps.length; i += 1) {
          if(mySpawnedPowerUps[i] != "") {
            mySpawnedPowerUps[i].x -= 2;
            mySpawnedPowerUps[i].update();
            if(mySpawnedPowerUps[i].x < -50) {
              mySpawnedPowerUps[i] = "";
            }
            //Det som skjer dersom spillfiguren plukker opp en powerup
            if (myGamePiece.pickUp(mySpawnedPowerUps[i])) {
              console.log(myGamePiece.image.style.opacity);
              var currentPowerup = mySpawnedPowerUps[i].powerup;
              console.log(currentPowerup);
              myPowerUps[0][currentPowerup]();
              if(mySpawnedPowerUps[i].powerup == 0) {
                powerMelding = "Boo!";
                spook = true
              } else if(mySpawnedPowerUps[i].powerup == 1) {
                powerMelding = "x2 Poeng!";
                dobbel = true
              } else if(mySpawnedPowerUps[i].powerup == 2) {
                powerMelding = "500 BONUS!";
                spook = true
              } else if(mySpawnedPowerUps[i].powerup == 3) {
                powerMelding = "Å nei, Atle tok 250 poeng!";
                spook = true
              }

              setTimeout(spooking,5000) //Hvor lenge man får tilbakemelding dersom man har plukket opp en powerup
              function spooking() {
                spook = false
              }
              setTimeout(dobbeling,10000)
              function dobbeling() {
                dobbel = false
              }
              mySpawnedPowerUps[i] = "";
            }
          }
        }
        for (let i = 0; i < myObstacles.length; i += 1) {
          if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
              //Bestemmer highscore
           if(score > highscore) {
          highscore = score
           }
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
        if(score >= 1000 && score < 2000) {
          myGameArea.canvas.style.backgroundImage = "url(bilder/level2.png)";
        } else if(score >= 2000) {
          myGameArea.canvas.style.backgroundImage = "url(bilder/NTNU.jpg)";
        }
      /*  myGameArea.context.fillStyle = "rgba(255,255,255,0)";
        myGameArea.context.fillRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height);
        console.log("juan");
        setTimeout(function() {
          console.log("reeee");
        },3000)*/
        //light = setInterval(checkScore, 3000);
        //setTimeout(function(){light=0;},5000);
    }
    /* For later
    var light = 0;
    if(score <= 2000) {
      setInterval(function() {
        if(light >= 0 && light <= 2) {
          myGameArea.context.fillStyle = "rgba(255,255,255,0.25)";
          myGameArea.context.fillRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height);
          light++;
        } else if (light == 2) {
          myGameArea.context.fillStyle = "rgba(255,255,255,0)";
          myGameArea.context.fillRect(0,0,myGameArea.canvas.width,myGameArea.canvas.height);
          light = 0;
        }
      },3000)
    }*/
    let spawnRate = 0;
    var myTiles = [

    ];
    var myTiles2 = [

    ];
    var tilesNr = 0;
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
    var tiles = (Math.random() * maxHeight + minHeight) - chosenValue;
    myObstacles.push(
    new component(
      20,
      -tiles,//-(Math.random() * maxHeight + minHeight) - chosenValue,
      "blue",
      960,
      540 - (chosenValue)
    )
    )
    myTiles2.push([]);
    for(let i = 0; i < tiles/20; i++) {
      myTiles2[tilesNr].push(
        new component(
          20,
          -20,
          "bilder/tile.png",
          960,
          540-chosenValue-i*20,
          "image"
        )
      )
    }
    }
    function spawnObstacle2() {
    //console.log(spawnRate);
    minWidth = 20;
    maxWidth = 120;
    minHeight = 120;
    maxHeight = 160;
    var chosenValue = Math.random() < 0.5 ? 0 : 40;
    tilesNr++;
    myObstacles.push(
    new component(
      20,
      -tiles,
      "rgba(255,255,255,0)",
      960,
      540 - (chosenValue)
    )
    )
    }
    setInterval(randomPowerup, 14899)


    function randomPowerup(){
    let test2 = (Math.random() * (15-10)+10) * 1000
    console.log("Spawnrate "+spawnRate);
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
    textX -= 2;
    text.font = "30px Arial";
    text.fillStyle = "red";
    text.fillText("Stein Jumper",textX,100);
    }
    function newHighscore(){ // Logger score til spiller, og sjekker om denne er bedre enn gjeldende highscore. Hvis den er større vil den spørre om navnet til spilleren og logge scoren og navn til spilleren i Hall of Fame
      let highScoreField = false;
      if (score >= highscore && score != 0 && highScoreField == false) {
        highScoreField = true;
        var input = document.createElement("input");
        var btn = document.createElement("button");
        var btntxt = document.createTextNode("Send inn din highscore!");
        btn.appendChild(btntxt);
        document.body.appendChild(input);
        document.body.appendChild(btn)
        input.setAttribute("type", "text")
        // input.setAttribute("autofocus", "")
        // input.focus();
        input.setAttribute("style", "")
        btn.addEventListener('click', saveInput)
        setTimeout(saveInput, 15000)

        function saveInput(){
          if (input.value.length >= 1) {
          let scoreTracker = {
            name: [],
            score: []
          }
          console.log("Button clicked")
          scoreTracker.name.push(input.value)
          scoreTracker.score.push(score)
          console.log(scoreTracker.name, scoreTracker.score)
          var scoreinput = document.getElementById("scoreInput");
          var text = scoreTracker.name + ", med score " + scoreTracker.score + "!<br />";
          document.getElementById("scoreInput").innerHTML += text
          input.remove(0);
          btn.remove(0);
          scoreTracker.name = "";
          scoreTracker.score = "";
          highScoreField = false;
        } else {
          input.remove(0)
          btn.remove(0)
        }
        }
      }
    }
  let counter = 0;
    function toggleMute(){
      counter++
        let music = document.getElementById("music")
        music.volume = 0.0;
        document.getElementById("muteBtn").innerHTML = "&#x1F507;";
        // music.setAttribute("volume","0.0")
        if (counter >= 2) {
          counter = 0;
          music.volume = 1.0;
          document.getElementById("muteBtn").innerHTML = "&#128266;";
        }
      }
