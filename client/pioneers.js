Session.setDefault('player_id', null);
Session.setDefault('game_id', null);


var player = function(){
  if (Session.equals('game_id', null)) return;
  if (Meteor.userId() === null) return;
  return Players.findOne({user_id: Meteor.userId(), game_id: Session.get('game_id')});
};

var games = function(){
  return Games.find();
};

var game = function(){
  if (Session.equals('game_id', null)) return;
  return Games.findOne(Session.get('game_id'));
};

var players = function(){
  if (Session.equals('game_id', null)) return;
  return Players.find({game_id: Session.get('game_id')});
};

var spectators = function(){
  if (Session.equals('game_id', null)) return;
  return Spectators.find({game_id: Session.get('game_id')});
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
  }
});

Template.players.players = players;

Template.turn.myturn = function() {
  return player() && true;
};
Template.turn.canBuildCity = function() {
  return true;
};
Template.turn.canBuildSettlement = function() {
  return true;
};
Template.turn.canBuildRoad = function() {
  return true;
};
Template.turn.canPlayCard = function() {
  return true;
};
Template.turn.canTakeCard = function() {
  return true;
};
Template.turn.canTradeWithPlayer = function() {
  return true;
};
Template.turn.canTradeWithBank = function() {
  return true;
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
      user_id: Meteor.userId()
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
