const rg = require('./room_gen');

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            fireBullet: fireBullet,
            handlePlayerMove: handlePlayerMove,
            handlePlayerAttack: handlePlayerAttack
        }
    }
};

var game = new Phaser.Game(config);

var score = 0;
var scoreText;

var playerSpeed = 160;
var bulletSpeed = playerSpeed * 1.75;
var bulletVelocityX = 0;
var bulletVelocityY = 0;
var attackInterval = null;
var attackSpeed = 250;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bullet', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create () {
    this.add.image(400, 300, 'sky');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setCollideWorldBounds(true);

    var cb = createObstacles.bind(this);
    console.log(this);
    cb();

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(this.player, this.platforms);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, this.platforms);
    this.physics.add.overlap(this.player, stars, collectStar, null, this);

    function collectStar (player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        }
    }

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.bullets = this.physics.add.group();

    this.physics.add.collider(this.bullets, this.platforms);

    setInterval(this.fireBullet.bind(this), attackSpeed);
}

function update () {
    this.handlePlayerMove();
    this.handlePlayerAttack();
}

function fireBullet(direction) {
    if (bulletVelocityX === 0 && bulletVelocityY === 0) return;

    var bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
    bullet.setBounce(0);
    bullet.setCollideWorldBounds(true);
    bullet.setVelocity(bulletVelocityX, bulletVelocityY);

    var self = this;
    setTimeout(function() {
        self.bullets.remove(bullet, true, true);
    }, 3000);
}

function handlePlayerMove() {
    keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
    });

    if (keys.w.isDown) {
        this.player.setVelocityY(-playerSpeed);
    }
    else if (keys.s.isDown) {
        this.player.setVelocityY(playerSpeed);
    }
    else {
        this.player.setVelocityY(0);
    }
    if (keys.a.isDown) {
        this.player.setVelocityX(-playerSpeed);

        this.player.anims.play('left', true);
    }
    else if (keys.d.isDown) {
        this.player.setVelocityX(playerSpeed);

        this.player.anims.play('right', true);
    }
    else {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
    }
}

function handlePlayerAttack() {
    cursors = this.input.keyboard.createCursorKeys();
    
    if (cursors.up.isDown) {
        bulletVelocityY = -bulletSpeed;
    }
    else if (cursors.down.isDown) {
        bulletVelocityY = bulletSpeed;
    }
    else {
        bulletVelocityY = 0;
    }
    if (cursors.left.isDown) {
        bulletVelocityX = -bulletSpeed;
    }
    else if (cursors.right.isDown) {
        bulletVelocityX = bulletSpeed;
    }
    else {
        bulletVelocityX = 0;
    }
}

function createObstacles() {
    var phaser = this;
    let room = rg.genRoom(rg.randomInt(2, 6));
    room.obstacles.forEach(function(obstacle) {
        let rect = rg.poly4ToRectangle(obstacle);
        let phaserRect = phaser.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x6666ff);
        phaser.physics.add.existing(phaserRect);
        phaser.physics.add.collider(phaser.player, phaserRect);
    })

    // this.platforms = this.physics.add.staticGroup();

    // this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // this.platforms.create(600, 400, 'ground');
    // this.platforms.create(50, 250, 'ground');
    // this.platforms.create(750, 220, 'ground');
}