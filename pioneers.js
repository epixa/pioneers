Games = new Meteor.Collection("games");
Players = new Meteor.Collection("players");
Spectators = new Meteor.Collection("spectators");

WOOD = 'wo';
WHEAT = 'wh';
SHEEP = 'sh';
STONE = 'st';
BRICK = 'br';
DESERT = 'ds';

RESOURCES = [
  WOOD, WOOD, WOOD, WOOD,
  WHEAT, WHEAT, WHEAT, WHEAT,
  SHEEP, SHEEP, SHEEP, SHEEP,
  STONE, STONE, STONE,
  BRICK, BRICK, BRICK,
  DESERT
];

CITY_COST = (function() {
  var cost = {};
  cost[STONE] = 3;
  cost[WHEAT] = 2;
  return cost;
})();

SETTLEMENT_COST = (function() {
  var cost = {};
  cost[BRICK] = 1;
  cost[SHEEP] = 1;
  cost[WHEAT] = 1;
  cost[WOOD] = 1;
  return cost;
})();

ROAD_COST = (function() {
  var cost = {};
  cost[BRICK] = 1;
  cost[WOOD] = 1;
  return cost;
})();

CARD_COST = (function() {
  var cost = {};
  cost[SHEEP] = 1;
  cost[STONE] = 1;
  cost[WHEAT] = 1;
  return cost;
})();

DICE_ROLLS = [
  3, 2, 3, 4, 4, 5, 10, 12, 6, 8, 8, 9, 9, 5, 10, 11, 11, 6
];

randomTiles = function() {
  var newResources = [];
  var resource_copy = RESOURCES.map(identity);
  var rolls_copy = DICE_ROLLS.map(identity);
  RESOURCES.forEach(function(){
    var key = Math.floor(Math.random() * resource_copy.length);
    var resource = resource_copy.splice(key, 1).pop();
    var roll = resource === DESERT ? null : rolls_copy.pop();
    newResources.push({ resource: resource, number: roll });
  });
  return newResources;
};

function identity() {
  return arguments[0];
};
