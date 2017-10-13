var util = {
  uuid: function () {
    /*jshint bitwise:false */
    var i, random;
    var uuid = '';

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
  }
}

var brain = {
  init: function() {
    var tTemplate = document.getElementById('thought-template').innerHTML;
    this.thoughtTemplate = Handlebars.compile(tTemplate);
    this.thoughts = util.storeRead('thoughts');
    view.setUpEventListeners();
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
  changeThought: function(position, thoughtText) {
    this.thoughts[position].thoughtText = thoughtText;
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
  deleteThought: function(position) {
    this.thoughts.splice(position, 1);
  }
};


var handler = {
  addThought: function () {
    var addThoughtTextInput = document.getElementById('addThoughtTextInput');
    brain.addThought(addThoughtTextInput.value);
    addThoughtTextInput.value = '';
    view.displayThoughts();
  },
  changeThought: function(position, thoughtText) {
    var changeThoughtPositionInput = document.getElementById('changeThoughtPositionInput');
    var changeThoughtTextInput = document.getElementById('changeThoughtTextInput');
    brain.changeThought(changeThoughtPositionInput.valueAsNumber, changeThoughtTextInput.value);
    changeThoughtPositionInput.value = '';
    changeThoughtTextInput.value = '';
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
  deleteThought: function(position) {
    brain.deleteThought(position);
    view.displayThoughts();
  }
};


var view = {
  displayThoughts: function() {
    var thoughts = brain.thoughts;
    var test = document.getElementById('thought-list');
    test.innerHTML =  brain.thoughtTemplate(thoughts);
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  setUpEventListeners: function() {
    var thoughtsUl = document.getElementById('thought-list');

    thoughtsUl.addEventListener('click', function(event) {
      console.log(event.target.parentNode.id);

      var elementClicked = event.target;

      if (elementClicked.className === 'deleteButton') {
        handler.deleteThought(parseInt(elementClicked.parentNode.id));
      }
    });
  }
};

brain.init();
