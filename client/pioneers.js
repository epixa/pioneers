Session.setDefault('player_id', null);
Session.setDefault('game_id', null);


var player = function() {
  if (Session.equals('game_id', null)) return;
  if (Meteor.userId() === null) return;
  return Players.findOne({user_id: Meteor.userId(), game_id: Session.get('game_id')});
};

var games = function() {
  return Games.find();
};

var game = function() {
  if (Session.equals('game_id', null)) return;
  return Games.findOne(Session.get('game_id'));
};

var players = function() {
  if (Session.equals('game_id', null)) return;
  return Players.find({game_id: Session.get('game_id')});
};

var spectators = function() {
  if (Session.equals('game_id', null)) return;
  return Spectators.find({game_id: Session.get('game_id')});
};

var myturn = function() {
  return player() && game().current_player === player().id;
};

Template.index.games = games;
Template.index.notGame = function(){
  return !game();
};
Template.index.events({
  'click .game-link': function() {
    Router.goto(this._id);
  },
  'click .clear': function() {
    Players.find().forEach(function(player){
      Players.remove(player._id);
    });
    Games.find().forEach(function(game){
      Games.remove(game._id);
    });
  }
});

Template.game.game = game;
Template.game.player = player;
Template.game.events({
  'click .go-home': function() {
    Router.goto();
  },
  'click .leave-game': function() {
    Players.remove(player()._id);
  },
  'click .delete-game': function() {
    players().forEach(function(player){
      Players.remove(player._id);
    });
    Games.remove(game()._id);
    Router.goto();
  },
  'click .build-city': function() {
    // todo: prompt user to select which settlement they want to upgrade to a city before doing the following
    [STONE, WHEAT].forEach(function(resource) {
      player().resources[resource] -= CITY_COST[resource];
    });
  },
  'click .build-settlement': function() {
    // todo: prompt user to select where they want to build a settlement before doing the following
    [BRICK, SHEEP, WHEAT, WOOD].forEach(function(resource) {
      player().resources[resource] -= SETTLEMENT_COST[resource];
    });
  },
  'click .build-road': function() {
    // todo: prompt user to select where they want to build the road before doing the following
    [BRICK, WOOD].forEach(function(resource) {
      player().resources[resource] -= ROAD_COST[resource];
    });
  },
  'click .play-card': function() {
    console.log('play card');
  },
  'click .take-card': function() {
    // todo: prompt user to confirm that they want to take a card before doing the following
    [SHEEP, STONE, WHEAT].forEach(function(resource) {
      player().resources[resource] -= CARD_COST[resource];
    });
  },
  'click .trade .with-player': function() {
    console.log('trade with player');
  },
  'click .trade .with-bank': function() {
    console.log('trade with bank');
  }
});

Template.players.players = players;

Template.turn.myturn = function() {
  return myturn();
};
Template.turn.canBuildCity = function() {
  return myturn()
      && player().resources[WHEAT] >= 3
      && player().resources[STONE] >= 2;
};
Template.turn.canBuildSettlement = function() {
  return myturn()
      && player().resources[WOOD] >= 1
      && player().resources[WHEAT] >= 1
      && player().resources[SHEEP] >= 1
      && player().resources[BRICK] >= 1;
};
Template.turn.canBuildRoad = function() {
  return myturn()
      && player().resources[WOOD] >= 1
      && player().resources[BRICK] >= 1;
};
Template.turn.canPlayCard = function() {
  return myturn() && player().cards.length;
};
Template.turn.canTakeCard = function() {
  return myturn()
      && player().resources[WHEAT] >= 3
      && player().resources[SHEEP] >= 3
      && player().resources[STONE] >= 2;
};
Template.turn.canTradeWithPlayer = function() {
  return myturn();
};
Template.turn.canTradeWithBank = function() {
  return myturn()
      && (player().resources[WOOD] >= 4
        || player().resources[WHEAT] >= 4
        || player().resources[SHEEP] >= 4
        || player().resources[BRICK] >= 4);
};

Template.board.tiles = function() {
  return game().tiles;
}

Template.joingame.canJoinGame = function() {
  return Meteor.userId() && !player();
};
Template.joingame.events({
  'click .join-game': function() {
    Players.insert({
      name: Meteor.user().username,
      game_id: Session.get('game_id'),
      user_id: Meteor.userId(),
      cards: [],
      resources: (function() {
        var resources = {};
        resources[BRICK] = 0;
        resources[SHEEP] = 0;
        resources[STONE] = 0;
        resources[WHEAT] = 0;
        resources[WOOD] = 0;
        return resources;
      })()
    })
  },
  'click .dont-join-game': function() {
    Router.goto();
  }
});


Router = new (Backbone.Router.extend({
  routes: {
    "": "index",
    ":game_id": "game"
  },
  index: function() {
    Session.set("game_id", null);
  },
  game: function(gameId) {
    var oldGameId = Session.get("game_id");
    if (oldGameId !== gameId) {
      Session.set("game_id", gameId);
    }
  },
  goto: function(gameId) {
    this.navigate(gameId, true);
  }
}));

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
