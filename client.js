var brain = {
  thoughts: [],
  addThought: function(thoughtText) {
    this.thoughts.push({
      thoughtText: thoughtText
    });
  },
  changeThought: function() {
    console.log('change thought called')
  },
  deleteThought: function() {
    console.log('delete thought called')
  }
};

var handler = {
  addThought: function () {
    var addThoughtTextInput = document.getElementById('addThoughtTextInput');
    brain.addThought(addThoughtTextInput.value);
    addThoughtTextInput = '';
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
