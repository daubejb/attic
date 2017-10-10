var brain = {
  thoughts: [],
  addThought: function(thoughtText) {
    this.thoughts.push({
      thoughtText: thoughtText
    });
  },
  changeThought: function(position, thoughtText) {
    this.thoughts[position].thoughtText = thoughtText;
  },
  deleteThought: function(position) {
    this.thoughts.splice(position, 1);
  }
};

var handler = {
  addThought: function () {
    var addThoughtTextInput = document.getElementById('addThoughtTextInput');
    brain.addThought(addThoughtTextInput.value);
    addThoughtTextInput = '';
    view.displayThoughts();
  },
  changeThought: function(position, thoughtText) {
    var changeThoughtPositionInput = document.getElementById('changeThoughtPositionInput');
    var changeThoughtTextInput = document.getElementById('changeThoughtTextInput');
    brain.changeThought(changeThoughtPositionInput.valueAsNumber, changeThoughtTextInput.value);
    changeThoughtPositionInput = '';
    changeThoughtTextInput = '';
    view.displayThoughts();
  },
  deleteThought: function(position) {
    brain.deleteThought(position);
    view.displayThoughts();
  }
};


var view = {
  displayThoughts: function() {
    var thoughtsUl = document.querySelector('#thoughtsList');
    thoughtsUl.innerHTML = '';

    brain.thoughts.forEach(function(thought){
      var thoughtLi = document.createElement('li');
      var thoughtText = thought.thoughtText;

      thoughtLi.textContent = thoughtText;
      thoughtLi.appendChild(this.createDeleteButton());
      thoughtsUl.appendChild(thoughtLi);
    }, this);
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  setUpEventListeners: function() {
    var thoughtsUl = document.querySelector('ul');

    thoughtsUl.addEventListener('click', function(event) {
      console.log(event.target.parentNode.id);

      var elementClicked = event.target;

      if (elementClicked.className === 'deleteButton') {
        handler.deleteThought(parseInt(elementClicked.parentNode.id));
      }
    });
  }
};

view.setUpEventListeners();
