Games = new Meteor.Collection("games");
Players = new Meteor.Collection("players");
Spectators = new Meteor.Collection("spectators");

RESOURCES = [
  'wo', 'wo', 'wo', 'wo',
  'wh', 'wh', 'wh', 'wh',
  'sh', 'sh', 'sh', 'sh',
  'st', 'st', 'st',
  'br', 'br', 'br',
  'ds'
];

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
    var roll = resource === 'ds' ? null : rolls_copy.pop();
    newResources.push({ resource: resource, number: roll });
  });
  return newResources;
};

function identity() {
  return arguments[0];
};
