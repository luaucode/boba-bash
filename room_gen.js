const minRoomWidth = 50; //800
const maxRoomWidth = 50; //1600
const minRoomHeight = 23; //600
const maxRoomHeight = 23; //900

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
    var obstacles = [];
    for (var i = 0; i < number; i++) {
        obstacles.push(genObstacle());
    }
    return obstacles;
}

function dumpRoom(room) {
    var b = room.boundaries;
    var lines = [];
    for (var row = 0; row < b[3].y; row++) {
        var line = '';
        for (var col = 0; col < b[1].x; col++) {
            if (row == 0 || row == b[3].y - 1 || col == 0 || col == b[1].x - 1) {
                line += '#';
            } else {
                line += '·';
            }
        }
        lines.push(line);
    }
    var txt = lines.join('\n');
    console.log(txt);
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
    dumpRoom,
    genRoom,
}
