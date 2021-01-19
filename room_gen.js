const minRoomWidth = 25; //800
const maxRoomWidth = 25; //1600
const minRoomHeight = 25; //600
const maxRoomHeight = 25; //900

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
    console.log(points);
    return points;
}

function genRoomBoundaries() {
    return genRectangle(minRoomWidth, minRoomHeight, maxRoomWidth, maxRoomHeight);
}

function genObstacles(number) {
    var obstacles = [];
    for (var i = 0; i < number; i++) {
        obstacles.push(genRectangle(2, 2, 4, 4));
    }
    return obstacles;
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
    for (var i = 0; i < obstacles.length; i++) {
        if (pointInRect(obstacles[i], row, col)) {
            return true;
        }
    }
    return false;
}

function dumpRoom(room) {
    var b = room.boundaries;
    var lines = [];
    for (var row = 0; row < b[3].y; row++) {
        var line = '';
        for (var col = 0; col < b[1].x; col++) {
            if (col == 2 && row == 3) {
                console.log(room.obstacles);
                console.log('isObstacle returned ' + isObstacle(room.obstacles, row, col));
            }
            if (row == 0 || row == b[3].y - 1 || col == 0 || col == b[1].x - 1) {
                line += '#';
            } else if (isObstacle(room.obstacles, row, col)) {
                line += '◌';
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
    var room = {obstacles: []};

    // generate room boundaries
    room.boundaries = genRoomBoundaries();
    // generate obstacles
    var obstacles = genObstacles(1);
    for (var i = 0; i < obstacles.length; i++) {
        var offsetX = randomInt(1, room.boundaries[1].x - 1);
        var offsetY = randomInt(1, room.boundaries[2].y - 1);
        var shiftedPoints = shiftPolygon(obstacles[i], offsetX, offsetY);
        console.log(shiftedPoints);
        room.obstacles.push(shiftedPoints);
    }
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
    isObstacle,
    pointInRect,
}
