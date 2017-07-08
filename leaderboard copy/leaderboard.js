
PlayersList = new Mongo.Collection('players');
//UserAccounts = new Mongo.Collection('users');

if(Meteor.isClient){
    console.log("Hello client");
    Meteor.subscribe('thePlayers');
    Template.body.helpers({resolu: [{title: "HEllo #1"},{title: "HEllo #2"}]});
    
    Template.leaderboard.helpers({
    'player': function(){
        var currentUserId = Meteor.userId();
        return PlayersList.find({createdBy: currentUserId}, { sort: {score: -1, name: 1} });
    },
    'selectedClass': function(){
    var playerId = this._id;
    var selectedPlayer = Session.get('selectedPlayer');
    if(playerId == selectedPlayer){
        return "selected"     
    }
    },
    'selectedPlayer': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne({ _id: selectedPlayer });
}
    
});

    
    Template.leaderboard.events({
    
    'click .player': function(){
      var playerId = this._id;
    Session.set('selectedPlayer', playerId);
    console.log("You clicked a .player element");
    var selectedPlayer = Session.get('selectedPlayer');
    console.log(selectedPlayer);
},
    'click .increment': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    console.log(selectedPlayer);
         Meteor.call('updateScore', selectedPlayer, 5);
},
    'click .decrement': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    console.log(selectedPlayer);
         Meteor.call('updateScore', selectedPlayer, -5);
},
'click .remove': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('removePlayer', selectedPlayer);
}
});

Template.addPlayerForm.events({

  'submit form': function(event){
    event.preventDefault();
    console.log("Form submitted");
    console.log(event.type);
    var playerNameVar = event.target.playerName.value;
      console.log(playerNameVar);
    Meteor.call('createPlayer', playerNameVar);

    event.target.playerName.value = "";   
  }
});

}

if(Meteor.isServer){
    console.log("Hello server");
    Meteor.publish('thePlayers', function(){
   var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId});
      //  return PlayersList.find();
});
}

Meteor.methods({
    'createPlayer': function(playerNameVar){
    check(playerNameVar, String);
    var currentUserId = Meteor.userId();
    if(currentUserId){
    PlayersList.insert({
    name: playerNameVar,
    createdBy: currentUserId,
    score: 0
});
}
    },
'removePlayer': function(selectedPlayer){
    check(selectedPlayer, String);
   var currentUserId = Meteor.userId();
    if(currentUserId){
        PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
    }
},
    'updateScore': function(selectedPlayer, scoreValue){
      check(selectedPlayer, String);   
     var currentUserId = Meteor.userId();
    if(currentUserId){
    PlayersList.update( { _id: selectedPlayer, createdBy: currentUserId },
                        { $inc: {score: scoreValue} });
    }
}
});