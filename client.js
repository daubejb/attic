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
  deleteThought: function() {
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
      thoughtsUl.appendChild(thoughtLi);
    });
  },
}
