class Game {
  constructor() {
    this.newPlayer = null;
    this.newGround = null;
    this.newEnemy = null;
    this.newBullet1 = null;
    this.newBullet2 = null;
    this.newBullet3 = null;
    this.bulletsArr = [];
    this.bulletsArr2 = [];
    this.bulletsArr3 = [];
    this.meteorArr = [];
    this.timeIdBullets1 = null;
    this.timeIdBullets2 = null;
    this.timeIdBullets3 = null;
    this.enemiesArr = [];

    

    this.startGame();
  }

  startGame() {
    this.newPlayer = new Player();
    this.newGround = new Ground();
    

    this.eventListenerMove();

    for (let i = 0; i < 3; i++) {
      this.newEnemy = new Enemy(i);
      this.enemiesArr.push(this.newEnemy);
      this.enemiesArr[i].positionX += this.newEnemy.positionX + 10;
      if (this.enemiesArr.length > 1)
      this.enemiesArr[i].positionX += this.enemiesArr[i - 1].positionX + 20;
      console.log(this.enemiesArr);
    }

   

                  //bullets for enemy1
    this.timeIdBullets1 = setTimeout(() => {
      setInterval(() => {
        this.newBullet1 = new Bullets1();
        this.bulletsArr.push(this.newBullet1);
      }, 2000);
    }, 3500);

    setInterval(() => {
      this.bulletsArr.forEach((bulletElm, index) => {
        bulletElm.moveDown(this.newPlayer.positionX);
        this.detectBulletColisionWithPlayer(bulletElm);
        this.deleteBullets(bulletElm, index);
      });
    }, 60);
                  //bullets for enemy2
    this.timeIdBullets2 = setTimeout(() => {
      setInterval(() => {
        this.newBullet2 = new Bullets2();
        this.bulletsArr.push(this.newBullet2);
      }, 2000);
    }, 4500);
    /*
    setInterval(() => {
      this.bulletsArr.forEach((bulletElm, index) => {
        bulletElm.moveDown(this.newPlayer.positionX);
        this.detectBulletColisionWithPlayer(bulletElm);
        this.deleteBullets(bulletElm, index);
      });
    }, 60);
    */
                  //bullets for enemy3
    this.timeIdBullets3 = setTimeout(() => {
      setInterval(() => {
        this.newBullet3 = new Bullets3();
        this.bulletsArr.push(this.newBullet3);
      }, 2000);
    }, 5500);
    /*
    setInterval(() => {
      this.bulletsArr.forEach((bulletElm, index) => {
        bulletElm.moveDown(this.newPlayer.positionX);
        this.detectBulletColisionWithPlayer(bulletElm);
        this.deleteBullets(bulletElm, index);
      });
    }, 60);
    */
    
                //meteors start falling
    setTimeout(() => {
      setInterval(() => {
        this.newMeteor = new Meteor();
        this.meteorArr.push(this.newMeteor);
        //console.log(this.meteorArr)
      }, 3000);
    }, 10000);

    setInterval(() => {
      this.meteorArr.forEach((meteorElm) => {
        //console.log(this.meteorArr);
        meteorElm.moveDown();
        this.detectBulletColisionWithPlayer(meteorElm);
        this.deleteMeteors(meteorElm);
      })
    }, 60);

    
  }

  eventListenerMove() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight") {
        this.newPlayer.moveRigth();
        console.log(this.newPlayer);
        
      } else if (e.code === "ArrowLeft") {
        this.newPlayer.moveLeft();
        console.log(this.newPlayer);
        
      } else if (e.code === "ArrowUp") {
        this.newPlayer.jump();
        console.log(this.newPlayer);
      }
    });
  }

  detectBulletColisionWithPlayer(bulletElm) {
    if (
      bulletElm.positionX < this.newPlayer.positionX + this.newPlayer.width &&
      bulletElm.positionX + bulletElm.width > this.newPlayer.positionX &&
      bulletElm.positionY < this.newPlayer.positionY + this.newPlayer.height &&
      bulletElm.height + bulletElm.positionY > this.newPlayer.positionY
    ) {
      console.log("colision with player detected");
      //location.href = "./lvl3.html";
    }
  }

  deleteBullets(bulletElm, index) {
    if (
      bulletElm.positionY < 8 - bulletElm.height ||
      bulletElm.positionX < 0 - bulletElm.width ||
      bulletElm.positionX > 100 + bulletElm.width
    ) {
      this.bulletsArr.splice(index, 1);
      bulletElm.bulletDom.remove();
    }
  }

  deleteMeteors(meteorElm) {
    if (
      meteorElm.positionY < 8 - meteorElm.height ||
      meteorElm.positionX < 0 - meteorElm.width ||
      meteorElm.positionX > 100 + meteorElm.width
    ) {
      this.meteorArr.splice(0, 1);
      meteorElm.meteorDom.remove();
    }
  }

}

class Player {
  constructor() {
    this.width = 2;
    this.height = 4;
    this.positionX = 50 - this.width / 2;
    this.positionY = 8;
    this.playerDom = null;
    this.rightTimerId = null;
    this.leftTimerId = null;
    this.jumpUpTimerId = null;
    this.jumpDownTimerId = null;
    this.isGoingLeft = false;
    this.isGoingRigth = false;
    this.isJumping = false;

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
    if (this.isGoingRigth) {
      return;
    }
    if (this.isGoingLeft) {
      clearInterval(this.leftTimerId)
      this.isGoingLeft = false;
    }
    this.isGoingRigth = true;
    this.rightTimerId = setInterval(() => {
      this.positionX += 1;
      this.playerDom.style.left = this.positionX + "vw";
      if (this.positionX >= 100 - this.width) {
        clearInterval(this.rightTimerId);
      }
    }, 80)
      

  }

  moveLeft() {
    if (this.isGoingLeft) {
      return;
    }
    if (this.isGoingRigth) {
      clearInterval(this.rightTimerId);
      this.isGoingRigth = false;
    }
    this.isGoingLeft = true;
    this.leftTimerId = setInterval(() => {
      this.positionX -= 1;
      this.playerDom.style.left = this.positionX + "vw";
      if (this.positionX <= 0) {
        clearInterval(this.leftTimerId);
      }
    }, 80)
  }

  jump() {
    if (this.isJumping) {
      return;
    }
    this.jumpUpTimerId = setInterval(() => {
      if (this.positionY > 30) {
        clearInterval(this.jumpUpTimerId);
        this.jumpDownTimerId = setInterval(() => {
          if (this.positionY < 10) {
            clearInterval(this.jumpDownTimerId);
            this.isJumping = false;
          }
          this.positionY -= 1;
          this.playerDom.style.bottom = this.positionY + "vh";
        }, 20)
      }
      this.isJumping = true;
      this.positionY += 1;
      this.playerDom.style.bottom = this.positionY + "vh";
    }, 20)
  }
}

class Enemy {
  constructor(index) {
    this.width = 6;
    this.height = 4;
    this.positionX = 0;
    this.positionY = 100 - this.height / 2;
    this.enemyDom = null;
    this.index = index

     
    this.createEnemy();
  }

  createEnemy() {
    this.enemyDom = document.createElement("div");
    const enemyTimeOutID = setTimeout(() => {
      this.enemyDom.id = "enemy" + this.index;
      this.enemyDom.style.height = this.height + "vh";
      this.enemyDom.style.width = this.width + "vw";
      this.enemyDom.style.left = this.positionX + "vw";
      this.enemyDom.style.bottom = this.positionY + "vh";
      this.enemyDom.innerText = "E";
      this.enemyParent = document.getElementById("board");
      this.enemyParent.appendChild(this.enemyDom);
    }, 3000);

    clearTimeout = enemyTimeOutID;

    setInterval(() => {
      if (this.enemyDom.style.bottom > 80 + "vh") {
        this.positionY -= 1;
        this.enemyDom.style.bottom = this.positionY + "vh";
      }
    }, 100);
  }
}

class Bullets1 {
  constructor() {
    this.width = 1;
    this.height = 2;
    this.positionX = 13 - this.width / 2;
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
    this.bulletParent = document.getElementById("enemy0");
    this.bulletParent.appendChild(this.bulletDom);
  }

  moveDown(x) {
    if (this.positionX > x) {
      this.positionY -= 1;
      this.positionX -= 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else if (this.positionX < x) {
      this.positionY -= 1;
      this.positionX += 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else {
      this.positionY -= 1;
      this.bulletDom.style.bottom = this.positionY + "vh";
    }
  }
}

class Bullets2 {
  constructor() {
    this.width = 1;
    this.height = 2;
    this.positionX = 43 - this.width / 2;
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
    this.bulletParent = document.getElementById("enemy1");
    this.bulletParent.appendChild(this.bulletDom);
  }

  moveDown(x) {
    if (this.positionX > x) {
      this.positionY -= 1;
      this.positionX -= 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else if (this.positionX < x) {
      this.positionY -= 1;
      this.positionX += 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else {
      this.positionY -= 1;
      this.bulletDom.style.bottom = this.positionY + "vh";
    }
  }
}

class Bullets3 {
  constructor() {
    this.width = 1;
    this.height = 2;
    this.positionX = 73 - this.width / 2;
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
    this.bulletParent = document.getElementById("enemy2");
    this.bulletParent.appendChild(this.bulletDom);
  }

  moveDown(x) {
    if (this.positionX > x) {
      this.positionY -= 1;
      this.positionX -= 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else if (this.positionX < x) {
      this.positionY -= 1;
      this.positionX += 0.5;
      this.bulletDom.style.left = this.positionX + "vw";
      this.bulletDom.style.bottom = this.positionY + "vh";
    } else {
      this.positionY -= 1;
      this.bulletDom.style.bottom = this.positionY + "vh";
    }
  }
}

class Meteor {
  constructor() {
    this.width = 4;
    this.height = 6;
    this.positionX = Math.floor(Math.random() * (100 - this.width) + 1);
    this.positionY = 100 - this.height;
    this.meteorDom = null;

    this.createMeteor();
  }

  createMeteor() {
    this.meteorDom = document.createElement("div");
    this.meteorDom.className = "meteor";
    this.meteorDom.style.height = this.height + "vh";
    this.meteorDom.style.width = this.width + "vw";
    this.meteorDom.style.left = this.positionX + "vw";
    this.meteorDom.style.bottom = this.positionY + "vh";
    this.meteorParent = document.getElementById("board");
    this.meteorParent.appendChild(this.meteorDom);
  }

  moveDown() {
    this.positionY -= 2;
    this.meteorDom.style.bottom = this.positionY + "vh";
  }
}

class Ground {
  constructor() {
    this.width = 100;
    this.height = 10;
    this.positionX = 0;
    this.positionY = 0;
    this.boxesArr = [];

    this.createGround();
  }

  createGround() {
    this.firstLayer = document.createElement("section");
    this.firstLayer.id = "ground";
    this.groundParent = document.getElementById("board");
    this.groundParent.appendChild(this.firstLayer);
  }
}



const newGame = new Game();