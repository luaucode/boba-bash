const rg = require('./room_gen');

test('randomInt', () => {
  expect(rg.randomInt(1, 2)).toBe(1);

  var value = rg.randomInt(4, 10);
  expect(value >= 4 && value < 10).toBe(true);
});

test('genRoomBoundaries', () => {
  var b = rg.genRoomBoundaries()
  expect(b).toHaveLength(4);

  var w = b[3].x
  var h = b[3].y
  
  expect(w >= rg.minRoomWidth && w <= rg.maxRoomWidth).toBe(true);
  expect(h >= rg.minRoomHeight && h <= rg.maxRoomHeight).toBe(true);
    
  expect(b[0]).toEqual({x:0, y:0});
  expect(b[1]).toEqual({x:w, y:0});
  expect(b[2]).toEqual({x:0, y:h});
  expect(b[3]).toEqual({x:w, y:h});
});
