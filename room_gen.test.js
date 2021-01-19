const rg = require('./room_gen');

test('randomInt', () => {
  expect(rg.randomInt(1, 2)).toBe(1);

  let value = rg.randomInt(4, 10);
  expect(value >= 4 && value < 10).toBe(true);
});

test('shiftPolygon', () => {
  let triangle = [{x: 10, y: 10}, {x: 5, y: 20}, {x: 15, y: 20}]
  let r = rg.shiftPolygon(triangle, 10, 20);
  expect(r[0]).toEqual({x: 20, y: 30});
  expect(r[1]).toEqual({x: 15, y: 40});
  expect(r[2]).toEqual({x: 25, y: 40});
});

test('genRoomBoundaries', () => {
  let b = rg.genRoomBoundaries();
  expect(b).toHaveLength(4);

  let w = b[3].x;
  let h = b[3].y;

  expect(w >= rg.minRoomWidth && w <= rg.maxRoomWidth).toBe(true);
  expect(h >= rg.minRoomHeight && h <= rg.maxRoomHeight).toBe(true);
    
  expect(b[0]).toEqual({x:0, y:0});
  expect(b[1]).toEqual({x:w, y:0});
  expect(b[2]).toEqual({x:0, y:h});
  expect(b[3]).toEqual({x:w, y:h});
});

// test('genRoom', () => {
//   let r = rg.genRoom();
//   rg.dumpRoom(r);
// });


test('pointInRect', () => {
  let rect = [{x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}];
  let x = 12;
  let y = 14;
  let p = rg.pointInRect(rect, x, y);
  expect(p).toBe(true);
  x = 21;
  y = 9;
  p = rg.pointInRect(rect, x, y);
  expect(p).toBe(false);
});

test('isObstacle', () => {
  let rectOne = [{x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}];
  let rectTwo = [{x: 40, y: 40}, {x: 60, y: 40}, {x: 40, y: 60}, {x: 60, y: 60}];
  let obstacles = [rectOne, rectTwo];
  let row = 3;
  let col = 67;
  let o = rg.isObstacle(obstacles, row, col);
  expect(o).toBe(false);
  row = 14;
  col = 12;
  o = rg.isObstacle(obstacles, row, col);
  expect(o).toBe(true);
});

// test('getPosSize', () => {
//   let points = [{x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}];
//   let pointsTwo = [{x: 40, y: 40}, {x: 60, y: 40}, {x: 40, y: 60}, {x: 60, y: 60}];
//   let g = rg.getPosSize(points);
//   console.log(g);
//   expect(g).toEqual({x: 10, y: 10, width: 10, height: 10});
//   g = rg.getPosSize(pointsTwo);
//   expect(g).not.toEqual({x: 10, y: 10, width: 10, height: 10});
//   expect(g).toEqual({x: 40, y: 40, width: 20, height: 20});
// });
