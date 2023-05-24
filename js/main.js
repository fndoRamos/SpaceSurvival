
class Game {
  constructor() {
    this.newPlayer = null;
    this.newGround = null;
    this.newEnemy = null;
    this.exitDoor = null;
    this.newBullet = null;
    this.fallTimer = null;
    this.isFfalling = true;
    this.bulletsArr = [];

    

    this.startGame();
  }

  startGame() {
    this.newPlayer = new Player();
    this.newGround = new Ground();
    this.newEnemy = new Enemy();
    this.exitDoor = new ExitDoor();

    this.eventListenerMove();
    this.fall();

    setTimeout(() => {
      setInterval(() => {
        this.newBullet = new Bullets();
        this.bulletsArr.push(this.newBullet);
        //console.log(this.bulletsArr);
      }, 2000);
    }, 2500);

    setInterval(() => {
      this.bulletsArr.forEach((bulletElm) => {
        bulletElm.moveDown(this.newPlayer.positionX, this.newPlayer.positionY);
        this.detectBulletColisionWithPlayer(bulletElm);
        this.deleteBullets(bulletElm);
      });
    }, 60);
  }

  eventListenerMove() {
    document.addEventListener("keydown", (e) => {
      this.fall();
      this.detectColisionPlayerWithGroundBox();
      if (e.code === "ArrowRight") {
        this.newPlayer.moveRigth();
        console.log(this.newPlayer);
        this.detectColisionExitDoor();
      } else if (e.code === "ArrowLeft") {
        this.newPlayer.moveLeft();
        console.log(this.newPlayer);
        this.detectColisionExitDoor();
      } else if (e.code === "ArrowUp") {
        this.newPlayer.jump();
        console.log(this.newPlayer);
      }
    });
  }

  detectColisionExitDoor() {
    if (
      this.exitDoor.positionX < this.newPlayer.positionX + this.newPlayer.width &&
      this.exitDoor.positionX + this.exitDoor.width > this.newPlayer.positionX &&
      this.exitDoor.positionY < this.newPlayer.positionY + this.newPlayer.height &&
      this.exitDoor.height + this.exitDoor.positionY > this.newPlayer.positionY
    ) {
      console.log("colision with door detected");
      location.href = "./lvl2.html";
    }
  }

  fall() {
    if (this.isFfalling) {
      this.fallTimer = setInterval(() => {
        this.newPlayer.positionY -= 1;
        this.newPlayer.playerDom.style.bottom = this.newPlayer.positionY + "vh";
        this.detectColisionPlayerWithGroundBox();

        if (this.newPlayer.playerDom.style.bottom === 0 - this.newPlayer.height + "vh") {
          clearInterval(this.fallTimer);
          this.newPlayer.playerDom.remove();
          this.isFfalling = false;
          location.href = "./lvl3.html";
        }
      }, 20);
    }
  }

  detectBulletColisionWithPlayer(bulletElm) {
    if (
      bulletElm.positionX < this.newPlayer.positionX + this.newPlayer.width &&
      bulletElm.positionX + bulletElm.width > this.newPlayer.positionX &&
      bulletElm.positionY < this.newPlayer.positionY + this.newPlayer.height &&
      bulletElm.height + bulletElm.positionY > this.newPlayer.positionY
    ) {
      //console.log("colision with player detected");
      //location.href = "./lvl3.html";
    }
  }

  detectColisionPlayerWithGroundBox() {
    //this.groundContainer = document.querySelector("#groundContainer")
    this.groundBoxArr = document.querySelectorAll(".groundBox");
    //console.log(this.groundContainer);
    //console.log(this.groundBoxArr);

    this.groundBoxArr.forEach((boxElm) => {
      this.boxHeightInVh = Math.round((boxElm.offsetHeight / window.innerHeight) * 100);
      this.boxWidthInVw = Math.round((boxElm.offsetWidth / window.innerWidth) * 100);
      this.boxPositionXInVw = Math.round((boxElm.offsetLeft / window.innerWidth) * 100);
      this.boxPositionYInVh = Math.round((boxElm.offsetTop / window.innerHeight) * 100);
      console.log(this.boxHeightInVh);
      console.log(this.boxPositionYInVh);
      console.log(this.boxWidthInVw);
      console.log(this.boxPositionXInVw);

      if (
        (this.newPlayer.positionX + this.newPlayer.width / 2) < this.boxPositionXInVw + this.boxWidthInVw &&
        this.newPlayer.positionX + this.newPlayer.width / 2 > this.boxPositionXInVw &&
        this.newPlayer.positionY <= this.boxPositionYInVh + this.boxHeightInVh &&
        this.newPlayer.height + this.newPlayer.positionY >= this.boxPositionYInVh
      ) {
        console.log("colision with ground detected");
        clearInterval(this.fallTimer);
        this.isFfalling = false;
      } else {
        this.isFfalling = true;
      }
    });
  }

  deleteBullets(bulletElm) {
    if (
      bulletElm.positionY < 15 - bulletElm.height ||
      bulletElm.positionX < 0 - bulletElm.width ||
      bulletElm.positionX > 100 + bulletElm.width
    ) {
      this.bulletsArr.shift();
      bulletElm.bulletDom.remove();
    }
  }
}

class Player {
  constructor() {
    this.positionX = 1;
    this.positionY = 50;
    this.width = 2;
    this.height = 4;
    this.playerDom = null;
    this.isJumping = false;
    this.isGoingLeft = false;
    this.isGoingRigth = false;

    this.createPlayer();
  }

  createPlayer() {
    this.playerDom = document.createElement("div");
    this.playerDom.id = "player";
    this.playerDom.style.height = this.height + "vh";
    this.playerDom.style.width = this.width + "vw";
    this.playerDom.style.left = this.positionX + "vw";
    this.playerDom.style.bottom = this.positionY + "vh";
    this.playerDom.innerText = "P";
    this.playerParent = document.getElementById("board");
    this.playerParent.appendChild(this.playerDom);
  }

  moveRigth() {
    if (this.positionX < 96) {
      this.positionX += 1;
      this.playerDom.style.left = this.positionX + "vw";
    }
  }

  moveLeft() {
    if (this.positionX > 0) {
      this.positionX -= 1;
      this.playerDom.style.left = this.positionX + "vw";
    }
  }

  jump() {
    let topJump = this.positionY + 15;
    if (this.isJumping === true) {
      return;
    }
    this.goingUpTimer = setInterval(() => {
      if (this.positionY === topJump) {
        clearInterval(this.goingUpTimer);
        this.goingDownTimer = setInterval(() => {
          if (this.positionY === 16) {
            clearInterval(this.goingDownTimer);
            this.isJumping = false;
          }
          this.positionY -= 1;
          this.playerDom.style.bottom = this.positionY + "vh";
        }, 15);
      }
      this.positionY += 1;
      this.playerDom.style.bottom = this.positionY + "vh";
      this.isJumping = true;
    }, 15);
  }
}

class Enemy {
  constructor() {
    this.width = 6;
    this.height = 4;
    this.positionX = 50 - this.width / 2;
    this.positionY = 100 - this.height;
    this.enemyDom = null;

    this.createEnemy();
  }

  createEnemy() {
    this.enemyDom = document.createElement("div");
    const enemyTimeOutID = setTimeout(() => {
      this.enemyDom.id = "enemy";
      this.enemyDom.style.height = this.height + "vh";
      this.enemyDom.style.width = this.width + "vw";
      this.enemyDom.style.left = this.positionX + "vw";
      this.enemyDom.style.bottom = this.positionY + "vh";
      this.enemyDom.innerText = "E";
      this.enemyParent = document.getElementById("board");
      this.enemyParent.appendChild(this.enemyDom);
    }, 3000);

    clearTimeout = enemyTimeOutID;

    const enemyIntervalId = setInterval(() => {
      if (this.enemyDom.style.bottom > 80 + "vh") {
        this.positionY -= 1;
        this.enemyDom.style.bottom = this.positionY + "vh";
      }
    }, 100);
  }
}

class Bullets {
  constructor() {
    this.width = 1;
    this.height = 2;
    this.positionX = 50 - this.width / 2;
    this.positionY = 78;
    this.bulletDom = null;

    this.createBullets();
  }

  createBullets() {
    this.bulletDom = document.createElement("div");
    this.bulletDom.className = "bullet";
    this.bulletDom.style.height = this.height + "vh";
    this.bulletDom.style.width = this.width + "vw";
    this.bulletDom.style.left = this.positionX + "vw";
    this.bulletDom.style.bottom = this.positionY + "vh";
    this.bulletParent = document.getElementById("enemy");
    this.bulletParent.appendChild(this.bulletDom);
  }

  moveDown(x, y) {
    if (this.positionX > x) {
      this.positionY -= 0.7;
      this.positionX -= 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else if (this.positionX < x) {
      this.positionY -= 0.7;
      this.positionX += 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else {
      this.positionY -= 0.7;
      this.bulletDom.style.bottom = this.positionY + "vh";
    }
  }
}

class Ground {
  constructor() {
    this.width = 100;
    this.height = 15;
    this.positionX = 0;
    this.positionY = 0;
    this.boxesArr = [];

    this.createGroundContainer();
    this.createGroundContainerBoxes();
  }

  createGroundContainer() {
    this.firstLayer = document.createElement("section");
    this.firstLayer.id = "groundContainer";
    this.groundParent = document.getElementById("board");
    this.groundParent.appendChild(this.firstLayer);
  }

  createGroundContainerBoxes() {
    for (let i = 0; i < 3; i++) {
      this.groundBox = document.createElement("div");
      this.groundBox.className = "groundBox";
      this.groundBoxParent = document.getElementById("groundContainer");
      this.groundBoxParent.appendChild(this.groundBox);
    }
  }
}

class ExitDoor {
  constructor() {
    this.height = 10;
    this.width = 4;
    this.positionX = 99 - this.width;
    this.positionY = 15;

    this.addExitDoor();
  }

  addExitDoor() {
    this.exitDoor = document.createElement("div");
    this.exitDoor.id = "exitDoor";
    this.exitDoor.style.height = this.height + "vh";
    this.exitDoor.style.width = this.width + "vw";
    this.exitDoor.style.left = this.positionX + "vw";
    this.exitDoor.style.bottom = this.positionY + "vh";
    this.exitDoorParent = document.getElementById("board");
    this.exitDoorParent.appendChild(this.exitDoor);
  }
}

const newGame = new Game();
