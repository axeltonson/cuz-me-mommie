import {Template} from 'meteor/templating'
import {Accounts} from 'meteor/accounts-base'
import {ReactiveDict} from 'meteor/reactive-dict'
import './main.html'

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.todos.helpers({
  'todo': function () {
    // on trie les todos chronologiquement
    return Todos.find({}, {sort: {createdAt: -1}})
  }
});

Template.todoItem.helpers({
  'activeUser': function () {
    if (Meteor.user() !== null) {
      if (Meteor.user().username == this.username) {
        return true
      } else {
        return false
      }
    }
  }
});

Template.addTodo.events({
  'submit form': function (event) {
    event.preventDefault();
    let todo = $('[name="todoName"]')
    let todoName = todo.val();
    Todos.insert({
      name: todoName,
      note: 0,
      completed: false,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
    todo.val('')
    todo.blur()
  }
});

Template.todoItem.events({
  'click button.plus': function (event) {
    event.preventDefault();
    Todos.update(this._id, {
      $set: {note: this.note + 1}
    })
  },
  'click button.minus': function (event) {
    event.preventDefault();
    Todos.update(this._id, {
      $set: {note: this.note - 1}
    })
  },
  'click .delete-todo': function (event) {
    event.preventDefault();
    let documentId = this._id;
    Todos.remove({_id: documentId})
  },
  'keyup [name=todoItem]': function (event) {
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur()
    } else {
      let documentId = this._id;
      let todoItem = $(event.target).val();
      Todos.update({_id: documentId}, {$set: {name: todoItem}})
    }
  },
  'keydown [name=todoItem]': function () {
    console.log("You're holding down a key on your keyboard.")
  },
  'keypress [name=todoItem]': function () {
    console.log("You just pressed one of the keys on your keyboard.")
  }
});