class Game {
  constructor() {
    this.newPlayer = null;
    this.newGround = null;
    this.newEnemy = null;
    this.exitDoor = null;

    this.startGame();
  }

  startGame() {
    this.newPlayer = new Player();
    this.newGround = new Ground();
    this.newEnemy = new Enemy();
    this.exitDoor = new ExitDoor();

    this.eventListenerMove();
  }

  eventListenerMove() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight") {
        this.newPlayer.moveRigth();
        this.detectColisionExitDoor();
      } else if (e.code === "ArrowLeft") {
        this.newPlayer.moveLeft();
        this.detectColisionExitDoor();
      } else if (e.code === "ArrowUp") {
        this.newPlayer.jump();
      }
    });
  }

  detectColisionExitDoor() {
    if (
      this.exitDoor.positionX <
        this.newPlayer.positionX + this.newPlayer.width &&
      this.exitDoor.positionX + this.exitDoor.width >
        this.newPlayer.positionX &&
      this.exitDoor.positionY <
        this.newPlayer.positionY + this.newPlayer.height &&
      this.exitDoor.height + this.exitDoor.positionY > this.newPlayer.positionY
    ) {
      console.log("colision detected");
      location.href = "./lvl2.html";
    }
  }
}

class Player {
  constructor() {
    this.positionX = 1;
    this.positionY = 15;
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
    this.bulletsArr = [];

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
    }, 5000);

    clearTimeout = enemyTimeOutID;

    const enemyIntervalId = setInterval(() => {
      if (this.enemyDom.style.bottom > 80 + "vh") {
        this.positionY -= 1;
        this.enemyDom.style.bottom = this.positionY + "vh";
      }
    }, 100);
    this.enemyShoot();
  }

  enemyShoot() {
    setTimeout(() => {
      this.bulletDom = document.createElement("div");
      this.bulletDom.className = "bullet";
      this.bulletDom.style.height = 2 + "vh";
      this.bulletDom.style.width = 2 + "vw";
      this.bulletDom.style.left = this.positionX + this.width / 2 - 1 + "vw";
      this.bulletDom.style.bottom = 78 + "vh";
      this.enemyParent.appendChild(this.bulletDom);
      this.bulletsArr.push(this.bulletDom);
    }, 7000);
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

