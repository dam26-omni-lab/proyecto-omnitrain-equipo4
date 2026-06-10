const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0f172a',
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let circulo;
let direccion = 1;

function create() {

    this.add.text(300, 50, 'NEXUS - Test Phaser', {
        fontSize: '32px',
        color: '#06b6d4'
    });

    circulo = this.add.circle(100, 300, 40, 0x06b6d4);

}

function update() {

    circulo.x += 3 * direccion;

    if (circulo.x > 900) {
        direccion = -1;
    }

    if (circulo.x < 100) {
        direccion = 1;
    }

    circulo.rotation += 0.03;
}