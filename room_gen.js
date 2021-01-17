const minRoomWidth = 800;
const maxRoomWidth = 1600;
const minRoomHeight = 600;
const maxRoomHeight = 900;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function genRectangle(minWidth, minHeight, maxWidth, maxHeight) {
    var width = randomInt(minWidth, maxWidth);
    var height = randomInt(minHeight, maxHeight);

    var topLeft = {x: 0, y: 0};
    var topRight = {x: width, y: 0};
    var botLeft = {x: 0, y: height};
    var botRight = {x: width, y: height};

    return [topLeft, topRight, botLeft, botRight];
}

function shiftPolygon(points, offsetX, offsetY) {
    for (var i = 0; i < points.length; i++) {
        points[i].x += offsetX;
        points[i].y += offsetY;
    }
    return points;
}

function genRoomBoundaries() {
    return genRectangle(minRoomWidth, minRoomHeight, maxRoomWidth, maxRoomHeight);
}

function genObstacle(minWidth, minHeight, maxWidth, maxHeight) {
    return genRectangle(minWidth, minHeight, maxWidth, maxHeight);
}

function genObstacles(number) {
    for (var i = 0; i < number; i++) {
        genObstacle();
    }
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
    shiftPolygon,
}
