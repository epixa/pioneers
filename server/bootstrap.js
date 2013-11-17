Meteor.startup(function () {
  if (Games.find().count() === 0) {
    var data = [
      {
        name: "First game",
        tiles: randomTiles(),
        settlements: [],
        roads: []
      },
      {
        name: "Second game",
        tiles: randomTiles(),
        settlements: [],
        roads: []
      },
      {
        name: "Third game",
        tiles: randomTiles(),
        settlements: [],
        roads: []
      }
    ];

    data.forEach(function(game){
      game.date_created = (new Date()).getTime();
      Games.insert(game);
    });
  };

  if (Meteor.users.find().count() === 0) {
    var users = [
      {
        username: 'Bob',
        email: 'bob@example.com',
        password: 'password'
      },
      {
        username: 'Shirly',
        email: 'shirly@example.com',
        password: 'password'
      },
      {
        username: 'Kurtis',
        email: 'kurtis@example.com',
        password: 'password'
      },
      {
        username: 'Courtney',
        email: 'courtney@example.com',
        password: 'password'
      },
      {
        username: 'Reject',
        email: 'reject@example.com',
        password: 'password'
      }
    ];
    users.forEach(function(user){
      Accounts.createUser(user);
    });
  }

});
