var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var util = {
  uuid: function () {
    /*jshint bitwise:false */
    var i, random;
    var uuid = '';
    var tempValue = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },
  storeWrite: function(namespace, data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  },
  storeRead: function(namespace) {
    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  },
  putTempValue: function(value) {
    this.tempValue = value;
  },
  getTempValue: function(value) {
    return this.tempValue;
  }

}

var brain = {
  init: function() {
    this.thoughts = util.storeRead('thoughts');
    var tTemplate = document.getElementById('thought-template').innerHTML;
    this.thoughtTemplate = Handlebars.compile(tTemplate);
    view.setUpEventListeners();
    view.displayThoughts();
  },
  thoughts: [],
  addThought: function(thoughtText) {
    var val = thoughtText.trim();

    this.thoughts.push({
      id: util.uuid(),
      thoughtText: val,
      connections: []
    });
    util.storeWrite('thoughts', this.thoughts);
  },
  changeThought: function(id, thoughtText) {
    var thoughtToChange = this.getThoughtById(id);
    var position = this.thoughts.indexOf(thoughtToChange);
    this.thoughts[position].thoughtText = thoughtText;
    util.storeWrite('thoughts', this.thoughts);
  },
  addConnection: function(sourcePosition, targetPosition, connectionType) {
    var connectionTypeText = this.getConnectionText(connectionType);
    this.thoughts[sourcePosition].connections.push(
      {
        direction: 'sending',
        connectionText: connectionTypeText.sending,
        targetPosition: targetPosition,
        connectionType: connectionType
      },
      {
        direction: 'receiving',
        connectionText: connectionTypeText.receiving,
        targetPosition: targetPosition,
        connectionType: connectionType
      }
    );
    // this.thoughts[targetPosition].connections.push(
    //   {
    //     direction: 'sending',
    //     connectionText: connectionTypeText.sending,
    //     targetPosition: targetPosition,
    //     connectionType: connectionType
    //   },
    //   {
    //     direction: 'receiving',
    //     connectionText: connectionTypeText.receiving,
    //     targetPosition: targetPosition,
    //     connectionType: connectionType
    //   }
    // );  --- I WAS WORKING ON THIS
  },
  getConnectionText: function(connectionType) {
    var sending = '';
    var receiving = '';
    switch (connectionType) {
      case 'synonym':
        sending = 'is synonymous to';
        receiving = 'is synonymous to';
        break;
      case 'antonym':
        sending = 'is opposite to';
        receiving = 'is opposite to';
        break;
      case 'part':
        sending = 'is a part of';
        receiving = 'contains';
        break;
      case 'type':
        sending = 'is a type of';
        receiving = 'includes';
        break;
      case 'object':
        sending = 'is used to';
        receiving = 'with a';
        break;
      case 'perform':
        sending = 'does';
        receiving = 'is done by';
        break;
      case 'cause':
        sending = 'is a cause of';
        receiving = 'is caused by';
        break;
      case 'symbol':
        sending = 'is a symbol of';
        receiving = 'is symbolized by';
        break;
    }
    var connectionTypeDirections = {
      'sendingText': sending,
      'receivingText': receiving
    };
    return connectionTypeDirections
  },
  getThoughtById: function(id) {
    for (i = 0; i < this.thoughts.length; i++) {
      if (id === this.thoughts[i].id) {
        return this.thoughts[i];
      }
    }
  },
  deleteThought: function(id) {
    var thoughtToDelete = this.getThoughtById(id);
    var position = this.thoughts.indexOf(thoughtToDelete);
    this.thoughts.splice(position, 1);
    util.storeWrite('thoughts', this.thoughts);
  }
};

var handler = {
  addThought: function (event) {
    var addThoughtTextInput = document.getElementById('addThoughtTextInput');
    var addThoughtTextInputValue = event.target.value;

    if (event.which !== ENTER_KEY || !addThoughtTextInputValue) {
      return;
    }

    brain.addThought(addThoughtTextInputValue);
    addThoughtTextInput.value = '';
    view.displayThoughts();
  },
  changeThought: function(id, thoughtText) {
    brain.changeThought(id, thoughtText);
    view.displayThoughts();
  },
  addConnection: function(sourcePosition, targetPosition, connectionType) {
    var sourceThoughtPositionInput = document.getElementById('sourceThoughtPositionInput');
    var targetThoughtPositionInput = document.getElementById('targetThoughtPositionInput');
    var connectionTypeInput = document.getElementById('connectionTypeInput');
    brain.addConnection(sourceThoughtPositionInput.valueAsNumber,
                         targetThoughtPositionInput.valueAsNumber,
                         connectionTypeInput.value);
    sourceThoughtPositionInput.value = '';
    targetThoughtPositionInput.value = '';
    connectionTypeInput.value = '';
    view.displayThoughts();
  },
  deleteThought: function(event) {
    var thoughtToDeleteId = event.target.parentNode.id;
    brain.deleteThought(thoughtToDeleteId);
    view.displayThoughts();
  }
};


var view = {
  mode: 'normal',
  displayThoughts: function() {
    var thoughts = brain.thoughts;
    var mode2 = view.mode;
    var test = document.getElementById('thought-list');
    test.innerHTML =  brain.thoughtTemplate(thoughts);
  },
  quickEditThought: function(event) {
    var thoughtLabel = event.target;
    var input = thoughtLabel.nextElementSibling;
    input.style.display = "inline";
    input.focus();
    var tempVal = input.value;
    util.putTempValue(tempVal);
    input.value = '';
    input.value = tempVal;
    thoughtLabel.style.display = "none";
  },
  selectThought: function(event) {
    selectedThought = event.target;
    if (selectedThought.classList.contains("thoughtView")) {
      view.mode = "thoughtSelected"
      if (selectedThought.classList.contains("selected")) {
        selectedThought.className = "thoughtView";
        console.log('class removed');
      } else {
        selectedThought.className += " selected";
        console.log('class added');
      }
    }
  },
  setUpEventListeners: function() {

    var addThoughtTextInput = document.getElementById('addThoughtTextInput');
    addThoughtTextInput.addEventListener('keyup', (event) => {
      handler.addThought(event);
    });

    var thoughtsUl = document.getElementById('thought-list');
    thoughtsUl.addEventListener('keyup', (event) => {
      var elementKeyUpped  = event.target;
      var id = elementKeyUpped.parentNode.parentNode.id;
        if (event.which === ENTER_KEY) {
          event.target.blur();
          var label = elementKeyUpped.previousElementSibling;
          label.innerHTML = elementKeyUpped.value;
          label.style.display = "inline";

          elementKeyUpped.style.display = "none";
          handler.changeThought(id, elementKeyUpped.value);
        }
        if (event.which === ESCAPE_KEY) {
          event.target.value = util.getTempValue();
          event.target.blur();
          var label = elementKeyUpped.previousElementSibling;
          label.style.display = "inline";
          elementKeyUpped.style.display = "none";
        }
    });
  }
};

brain.init();
