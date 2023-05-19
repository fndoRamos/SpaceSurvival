class Player {
    constructor() {
        this.positionX = 5;
        this.positionY = 10;
        this.width = 2;
        this.height = 4;

        this.createPlayer();
    }

    createPlayer() {
        this.createPlayerDom = document.createElement('div');

        this.createPlayerDom.style.height = this.height + 'vh';
        this.createPlayerDom.style.width = this.width + 'vw';
        this.createPlayerDom.style.left = this.positionX + 'vw';
        this.createPlayerDom.style.bottom = this.positionY + 'vh';
        this.createPlayerDom.innerText = 'p';
        this.playerParent = document.getElementById('board');
        this.playerParent.appendChild(this.createPlayerDom);
    }
}

const newPlayer = new Player();