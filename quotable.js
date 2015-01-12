Moods = new Meteor.Collection('moods');

var currentDate = function() {
    var date = new Date()
    date.getDate();
    return date;
}

Meteor.methods({
  removeMood: function(id) {
    var mood = Moods.findOne(id);
    Moods.remove(mood);
  },
  editMood: function(id) {
    console.log(id);
    Session.set('editedItem', id);
  }

})

if (Meteor.isClient) {

  Meteor.subscribe('moods');

  Template.list.helpers({
    moods: function() {
      return Moods.find({}, {sort: {date: -1}});
    },
    userSameAsCurrentUser: function() {
      var user = Meteor.user();
      return user._id === this.user._id ? true : false;
    },
    userEmail: function() {
      return this.user.emails[0].address;
    },
    editItem: function() {
      var id = Session.get('editedItem');
      return this._id === id ? true : false;
    }
  })

  Template.list.events({
    'click .remove': function(e) {
      e.preventDefault();
      Meteor.call('removeMood', this._id);
    },
    'click .edit': function(e) {
      e.preventDefault();
      Meteor.call('editMood', this._id);
    }
  })


  Template.editForm.helpers({
    editableText: function() {
      var id = Session.get('editedItem');
      var currText = Moods.findOne(id);
      console.log(currText);
      return currText;
    }
  })

  Template.editForm.events({
    'submit' : function(e) {
      e.preventDefault();
      var id = Session.get('editedItem');
      var feelings = $("#edits").serializeArray()[0].value;
      Moods.update({_id: id}, {$set:{feelings: feelings}});
      Session.set('editedItem', null);
    }
  })

  Template.enterText.helpers({
  })
  
  Template.enterText.events({
    'submit' : function(e) {
      var feelings = $("#feelings").serializeArray()[0].value;
      var date = currentDate();
      Moods.insert({
        feelings: feelings,
        user: Meteor.user(),
        time: Date.now(),
        date: date
      }, function(err) {
        if(!err) {
          $('#feelings')[0].reset();
        } else {
          console.log(err);
        }
      });
      event.preventDefault(); 
    }
});


}

if (Meteor.isServer) {

  Meteor.publish('moods', function() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return Moods.find({date: {$gt: date}});
  })

  Meteor.startup(function () {
  });
}
