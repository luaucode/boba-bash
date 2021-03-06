(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const rg = require('./room_gen');

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
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
    console.log('start');
    this.add.image(400, 300, 'sky');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setCollideWorldBounds(true);

    var cb = createObstacles.bind(this);
    this.obstacles = cb();

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

    this.physics.add.collider(this.player, this.obstacles);

    this.bullets = this.physics.add.group();

    this.physics.add.collider(this.bullets, this.obstacles);

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
    const minWidth = 800;
    const maxWidth = 800;
    const minHeight = 600;
    const maxHeight = 600;
    this.obstacles = this.physics.add.group();
    let phaser = this;
    let room = rg.genRoom(minWidth, maxWidth, minHeight, maxHeight, rg.randomInt(2, 6));
    room.obstacles.forEach(function(obstacle) {
        console.log(obstacle);
        let rect = rg.poly4ToRectangle(obstacle);
        let obs = phaser.obstacles.create(rect.x, rect.y, 'obstacle');
        let phaserRect = phaser.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x6666ff);
        phaser.physics.add.existing(phaserRect);
    })

    // this.platforms = this.physics.add.staticGroup();

    // this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // this.platforms.create(600, 400, 'ground');
    // this.platforms.create(50, 250, 'ground');
    // this.platforms.create(750, 220, 'ground');
}
},{"./room_gen":2}],2:[function(require,module,exports){
var minRoomWidth = 50; //800
var maxRoomWidth = 50; //1600
var minRoomHeight = 20; //600
var maxRoomHeight = 20; //900

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function genPoly4(minWidth, minHeight, maxWidth, maxHeight) {
    let width = randomInt(minWidth, maxWidth);
    let height = randomInt(minHeight, maxHeight);

    let topLeft = {x: 0, y: 0};
    let topRight = {x: width, y: 0};
    let botLeft = {x: 0, y: height};
    let botRight = {x: width, y: height};

    return [topLeft, topRight, botLeft, botRight];
}

function shiftPolygon(points, offsetX, offsetY) {
    for (let i = 0; i < points.length; i++) {
        points[i].x += offsetX;
        points[i].y += offsetY;
    }
    return points;
}


function genObstacles(number) {
    let obstacles = [];
    for (let i = 0; i < number; i++) {
        obstacles.push(genPoly4(30, 30, 100, 100));
    }
    return obstacles;
}

function poly4ToRectangle(points) {
    var x = points[0].x;
    var y = points[0].y;
    var width = points[1].x - points[0].x;
    var height = points[2].y - points[0].y;
    return {x: x, y: y, width: width, height: height};
}

function pointInRect(rect, x, y) {
    if (x < rect[0].x) {
        return false;
    }
    if (x > rect[1].x) {
        return false;
    }
    if (y < rect[0].y) {
        return false;
    }
    if (y > rect[2].y) {
        return false;
    }
    return true;
}

function isObstacle(obstacles, row, col) {    
    for (let i = 0; i < obstacles.length; i++) {
        if (pointInRect(obstacles[i], col, row)) {
            return true;
        }
    }
    return false;
}

function dumpRoom(room) {
    let b = room.boundaries;
    let lines = [];
    for (let row = 0; row < b[3].y; row++) {
        let line = '';
        for (let col = 0; col < b[1].x; col++) {
            if (row === 0 || row === b[3].y - 1 || col === 0 || col === b[1].x - 1) {
                line += '#';
            } else if (isObstacle(room.obstacles, row, col)) {
                line += 'Γùî';
            } else {
                line += '┬╖';
            }
        }
        lines.push(line);
    }
    let txt = lines.join('\n');
    console.log(txt);
}


function genRoom(minWidth, maxWidth, minHeight, maxHeight, numObstacles) {
    let room = {obstacles: []};

    // generate room boundaries
    room.boundaries = genPoly4(minWidth, maxWidth, minHeight, maxHeight);
    // generate obstacles
    let obstacles = genObstacles(numObstacles);
    room.obstacles = obstacles.map(function(obstacle) {
        let w = obstacle[1].x;
        let h = obstacle[2].y;
        let offsetX = randomInt(1, room.boundaries[1].x - 1 - w);
        let offsetY = randomInt(1, room.boundaries[2].y - 1 - h);
        return shiftPolygon(obstacle, offsetX, offsetY);
    });
    return room;
}

module.exports = {
    minRoomWidth,
    maxRoomWidth,
    minRoomHeight,
    maxRoomHeight,

    randomInt,
    shiftPolygon,
    dumpRoom,
    genRoom,
    isObstacle,
    pointInRect,
    poly4ToRectangle,
}

},{}]},{},[1]);
