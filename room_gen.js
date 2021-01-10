const minRoomWidth = 800;
const maxRoomWidth = 1600;
const minRoomHeight = 600;
const maxRoomHeight = 900;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function genRoomBoundaries() {
    var width = randomInt(minRoomWidth, maxRoomWidth);
    var height = randomInt(minRoomHeight, maxRoomHeight);

    var topLeft = {x: 0, y: 0};
    var topRight = {x: width, y: 0};
    var botLeft = {x: 0, y: height};
    var botRight = {x: width, y: height};
    
    points = [topLeft, topRight, botLeft, botRight];
    return points;
}

function genObstacles() {

}

function genRoom() {
    var room = {};

    // generate room boundaries
    room.boundaries = genRoomBoundaries();
    // generate obstacles
    room.obstacles = genObstacles();

    return room;
}

module.exports = {
    minRoomWidth,
    maxRoomWidth,
    minRoomHeight,
    maxRoomHeight,

    randomInt,
    genRoomBoundaries,
}
