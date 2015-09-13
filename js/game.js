/**
 * Created by John on 9/11/15.
 */

$(document).ready(function() {
  String.prototype.rejoin = function(symbol, splitDelimiter, joinDelimiter) {
    var subject = this,
        splitDelimiter = typeof splitDelimiter === 'string' ? splitDelimiter : ' ',
        joinDelimiter = typeof joinDelimiter === 'string' ? joinDelimiter : splitDelimiter,
        symbol = typeof symbol === 'string' ? symbol : '.',
        chunks = subject.split(splitDelimiter),
        modifiedChunkCollection = [];

    chunks.forEach(function(e, i) {
      modifiedChunkCollection.push(symbol + e);
    });

    return modifiedChunkCollection.join(joinDelimiter);
  };

  String.prototype.dotize = function() {
    return this.rejoin('.', ' ', '');
  };


  Array.prototype.getRandom = function() {
    return this[Math.floor(Math.random()*this.length)];
  };

  Math.randomBetween = function(min, max) {
    return Math.floor(Math.random() * max) + min
  };

  Array.prototype.shuffle = function() {
    var currentIndex = this.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this[currentIndex];
      this[currentIndex] = this[randomIndex];
      this[randomIndex] = temporaryValue;
    }

    return this;
  };

  /**
   * setBlock
   * @returns {Block}
   */
  $.fn.setBlock = function() {
    function Block(subject) {
      this.subject = subject;
    }

    Block.prototype.switchToDefaultBlock = function() {
      this.subject.removeClass('block-selected').addClass('block-default');
      return this.subject;
    };

    Block.prototype.switchToSelectedBlock = function() {
      this.subject.removeClass('block-default').addClass('block-selected');
      return this.subject;
    };

    return new Block($(this));
  };

  function Tasks() { return this;}

  Tasks.prototype.posAssociation = function(navigation, prevTask) {
    var _this = this;
    var task = {
      answerStartTime: 0,
      init: function(id, selection) {
        this.navigation = navigation;
        this.prevTask   = prevTask;

        this.loadBoard();
        this.hideSigns();
        this.loadNavigation();

      },
      fallCollection: ['nominativ', 'genitiv', 'dativ', 'akkusativ'],
      genderCollection:  ['m', 'v', 'o', 'mv'],
      layerCollection: ['der-group'],
      layerMap: {
        'der-group': {
          m:  {'nominativ': 'der', 'genitiv': 'des', 'dativ': 'dem', 'akkusativ': 'den'},
          v:  {'nominativ': 'die', 'genitiv': 'der', 'dativ': 'der', 'akkusativ': 'die'},
          o:  {'nominativ': 'das', 'genitiv': 'des', 'dativ': 'dem', 'akkusativ': 'das'},
          mv: {'nominativ': 'die', 'genitiv': 'der', 'dativ': 'den', 'akkusativ': 'die'}
        }
      },
      initPick: function() {
        this.pick.gender = this.genderCollection.getRandom();
        this.pick.fall = this.fallCollection.getRandom();
        this.pick.layer = this.layerCollection.getRandom();
      },
      loadBoard: function() {
        $('.frame.game-frame').html('<div class="container task"><span id="task-span"></span> <span id="previous-round"></span></div> <div class="container grid-cols"> <div class="block block-sign">.</div> <div class="block block-sign">1. Nominativ</div> <div class="block block-sign">2. Genitiv</div> <div class="block block-sign">3. Dativ</div> <div class="block block-sign">4. Akkusativ</div> </div> <div class="container grid-container" data-gender="m"> <div class="block block-sign">m</div> <div class="block block-default" data-fall="nominativ"> <img class="hidden" src="img/der.jpg" data-preposition="der"/> </div> <div class="block block-default" data-fall="genitiv"> <img class="hidden" src="img/des.jpg" data-preposition="des"/> </div> <div class="block block-default" data-fall="dativ"> <img class="hidden" src="img/dem.jpg" data-preposition="dem"/> </div> <div class="block block-default" data-fall="akkusativ"> <img class="hidden" src="img/den.jpg" data-preposition="den"/> </div> </div> <div class="container grid-container" data-gender="v"> <div class="block block-sign">v</div> <div class="block block-selected" data-fall="nominativ"> <img class="hidden" src="img/die.jpg" data-preposition="die"/> </div> <div class="block block-default" data-fall="genitiv"> <img class="hidden" src="img/der.jpg" data-preposition="der"/> </div> <div class="block block-default" data-fall="dativ"> <img class="hidden" src="img/der.jpg" data-preposition="der"/> </div> <div class="block block-default" data-fall="akkusativ"> <img class="hidden" src="img/die.jpg" data-preposition="die"/> </div> </div> <div class="container grid-container" data-gender="o"> <div class="block block-sign">o</div> <div class="block block-default" data-fall="nominativ"> <img class="hidden" src="img/das.jpg" data-preposition="das"/> </div> <div class="block block-default" data-fall="genitiv"> <img class="hidden" src="img/des.jpg" data-preposition="des"/> </div> <div class="block block-default" data-fall="dativ"> <img class="hidden" src="img/dem.jpg" data-preposition="dem"/> </div> <div class="block block-default" data-fall="akkusativ"> <img class="hidden" src="img/das.jpg" data-preposition="das"/> </div> </div> <div class="container grid-container" data-gender="mv"> <div class="block block-sign">mv</div> <div class="block block-default" data-fall="nominativ"> <img class="hidden" src="img/die.jpg" data-preposition="die"/> </div> <div class="block block-default" data-fall="genitiv"> <img class="hidden" src="img/der.jpg" data-preposition="der"/> </div> <div class="block block-default" data-fall="dativ"> <img class="hidden" src="img/den.jpg" data-preposition="den"/> </div> <div class="block block-default" data-fall="akkusativ"> <img class="hidden" src="img/die.jpg" data-preposition="die"/> </div> </div>');
      },
      hideSigns: function() {
        $('.block.block-sign').fadeTo(150, 0.001);
      },
      loadNavigation: function(callback) {
        // destroy the navigation of the previous board
        this.navigation.destroy();

        // Bind a new navigation to the current board
        var navigation = $('.container.grid-container:has(.block.block-selected)').setupNavigation();
        this.navigation = navigation;

        // Tell navigation to communicate with this task in the future
        this.navigation.currentTask = this;

      },
      onSpaceKeydown: ['init', 'setUserTask'],
      onEnterKeydown: [],
      setUserTask: function() {
        this.initPick();
        $('#task-span').text(this.taskText());
        this.onEnterKeydown = ['checkGenderAndFall', 'showResponse', 'scheduleNextTask'];
      },
      scheduleNextTask: function() {
        var nextTask = setTimeout(function() {

          // Set a new task when the answer is correct,
          // for wrong answer the task stays the same
          if(! task.checkGenderAndFall().error.length)
          {
            task.cleanBoard();
            task.nextTask();
          }

        }, 150);
      },
      nextTask: function() {
        new Tasks().imgAssociation().init(this);
      },
      cleanBoard: function(selection) {
        this.navigation.currentSelection.removeClass('correct-answer').removeClass('wrong-answer');
        $('.correct-answer').add('.wrong-answer').removeClass('correct-answer').removeClass('wrong-answer');
      },
      taskText: function() {
        return 'Find: ' + [this.pick.layer, this.pick.gender, this.pick.fall].join(', ');
      },
      pick: {layer: '', gender: '', fall: ''},
      getGenderAndFall: function() {
        var fall = this.navigation.currentSelection.data('fall'),
            gender = this.navigation.currentSelection.parent().data('gender');
        return {gender: gender, fall: fall};
      },
      showResponse: function() {
        this.responses[this.response]();
      },
      response: '',
      responses: {
        pass: function() {
          var answerTime = (new Date).getTime() - this.answerStartTime;
          //$('#previous-round').text(answerTime);
          $('#task-span').addClass('correct-answer');
          task.navigation.currentSelection.addClass('correct-answer');
        },
        fail: function(selection) {
          $('#task-span').addClass('wrong-answer');
          task.navigation.currentSelection.addClass('wrong-answer');
        }
      },
      checkGenderAndFall: function() {
        var answer = this.getGenderAndFall();
        if(! this.checkGender(answer.gender).error.length && ! this.checkFall(answer.fall).error.length) {
          this.response = 'pass';
          return {error: []};
        }
        else {
          this.response = 'fail';
          var genderCheck = this.checkGender(answer.gender),
              fallCheck = this.checkFall(answer.fall);
          return {error: [genderCheck.error.concat(fallCheck.error)]}
        }
      },
      checkFall: function(answer) {
        if(this.pick.fall === answer) return {error: []};
        else {
          return {error: ["Wrong fall, you've picked " + answer + ", instead of " + this.pick.fall + "!"]};
        }
      },
      checkGender: function(answer) {
        if(this.pick.gender === answer) return {error: []};
        else {
          return {error: ["Wrong gender, you've picked " + answer + ", instead of " + this.pick.gender + "!"]};
        }
      }
    };
    return task;
  };

  Tasks.prototype.imgAssociation = function() {
    var _this = this;
    var task = {
      answerStartTime: 0,
      init: function(posAssInstance) {
        this.posAssInstance = posAssInstance;

        this.loadBoard();
        this.loadNavigation();

        this.onEnterKeydown.forEach(function(ev, c) {
          task[ev]();
        });
      },
      nextTask: function() {
        this.endTask();
        return _this.posAssociation();
      },
      loadBoard: function() {
        $('.frame.game-frame .block > img').removeClass('hidden');

        var containerRandomCollection = $('.container.grid-container').clone().toArray().shuffle();
        $('.container.grid-container').detach();
        $('.frame.game-frame').append(containerRandomCollection);
      },
      loadNavigation: function() {
        // Tell the navigation to talk with us
        this.posAssInstance.loadNavigation();
        this.posAssInstance.navigation.currentTask = this;
        $.each(['up','up','left'].shuffle(), function(i, dir) {
          task.posAssInstance.navigation[dir]();
        });
      },
      cleanBoard: function() {
        if(this.originContainerOrder) $('.container.grid-container').detach() && $('.frame.game-frame').append(this.originContainerOrder);
        $('.block-default > img, .block-selected > img').addClass('hidden');
      },
      taskText: function() {
        return 'Find: the belonging image and gender';
      },
      layerMap: {
        'der-group': {
          m:  {'nominativ': 'der', 'genitiv': 'des', 'dativ': 'dem', 'akkusativ': 'den'},
          v:  {'nominativ': 'die', 'genitiv': 'der', 'dativ': 'der', 'akkusativ': 'die'},
          o:  {'nominativ': 'das', 'genitiv': 'des', 'dativ': 'dem', 'akkusativ': 'das'},
          mv: {'nominativ': 'die', 'genitiv': 'der', 'dativ': 'den', 'akkusativ': 'die'}
        }
      },
      setupFirstTask: function() {
        $('#task-span').text(this.taskText());
        this.onEnterKeydown = ['checkImgAndGender', 'scheduleNextTask'];
      },
      onSpaceKeydown: [''],
      onEnterKeydown: ['setupFirstTask'],
      scheduleNextTask: function() {
        var nextTask = setTimeout(function() {
          if(! task.checkImgAndGender().error.length) {
            task.cleanBoard();
            task.posAssInstance.onSpaceKeydown.forEach(function(ev, e) {
              task.posAssInstance[ev]();
            })
          }
        }, 150);
      },
      getImgPrepositionAndGender: function() {
        var preposition = this.posAssInstance.navigation.currentSelection.find('img').data('preposition'),
            gender = this.posAssInstance.navigation.currentSelection.parent().data('gender');
        return {preposition: preposition, gender: gender};
      },
      responses: {
        pass: function() {
          var answerTime = (new Date).getTime() - this.answerStartTime;
          //$('#previous-round').text(answerTime);
          $('#task-span').addClass('correct-answer');
          task.posAssInstance.navigation.currentSelection.addClass('correct-answer');
        },
        fail: function() {
          $('#task-span').addClass('wrong-answer');
          task.posAssInstance.navigation.currentSelection.addClass('wrong-answer');
        }
      },
      checkImgAndGender: function() {
        var answer = this.getImgPrepositionAndGender();
        if(answer.preposition === this.layerMap[this.posAssInstance.pick.layer][this.posAssInstance.pick.gender][this.posAssInstance.pick.fall]
          && answer.gender === this.posAssInstance.pick.gender) {
          this.responses.pass();
          return {error: []};
        }
        else {
          this.responses.fail();
          return {error: ['Wrong image or preposition']}
        }
      }
    };

    window.task = task;
    return task;
  };


  $.fn.setupNavigation = function() {

    function Navigation(currentLayer, currentSelection) {
      this.currentRow       = currentLayer;
      this.currentSelection = currentSelection;
      this.prevRowElement   = $('');
      return this;
    }

    Navigation.prototype.init = function() {
      var _this = this;
      $(document).on('keydown', function(event) {
        if(event.keyCode !== 37) return;
        _this.left();
      });

      $(document).on('keydown', function(event) {
        if(event.keyCode !== 32) return;
        _this.space();
      });

      $(document).on('keydown', function(event) {
        if(event.keyCode !== 39) return;
        _this.right();
      });

      $(document).on('keydown', function(event) {
        if(event.keyCode !== 40) return;
        _this.down();
      });

      $(document).on('keydown', function(event) {
        if(event.keyCode !== 13) return;
        _this.enter();
      });

      $(document).on('keydown', function(event) {
        if(event.keyCode !== 38) return;
        _this.up();
      });
    };

    Navigation.prototype.destroy = function() {
      $(document).off('keydown');
    };

    Navigation.prototype.left   =  function() {
      this.currentSelection.setBlock().switchToDefaultBlock();
      var prev = this.currentSelection.prev('.block.block-default').setBlock().switchToSelectedBlock();
      if(! prev.length) prev = this.currentRow.find('.block.block-default').last().setBlock().switchToSelectedBlock();
      this.currentSelection = prev;
      return this;
    };

    Navigation.prototype.right  =  function() {
      this.currentSelection.setBlock().switchToDefaultBlock();
      var next = this.currentSelection.next('.block').setBlock().switchToSelectedBlock();
      if(! next.length) next = this.currentRow.find('.block.block-default').first().setBlock().switchToSelectedBlock();
      this.currentSelection = next;
      return this;
    };

    Navigation.prototype.up     =  function() {
      this.currentSelection.setBlock().switchToDefaultBlock();
      var pos = this.currentRow.find(this.currentSelection)
          .prevAll('.block.block-default').length + 1;

      var prevRow = this.prevRow();

      var currentSelection = prevRow.find('.block.block-default').get(pos - 1);

      $(currentSelection).setBlock().switchToSelectedBlock();
      this.currentSelection = $(currentSelection);
      return this;
    };

    Navigation.prototype.down   =  function() {
      this.currentSelection.setBlock().switchToDefaultBlock();
      var pos = this.currentRow.find(this.currentSelection)
          .prevAll('.block.block-default').length + 1;

      var nextRow = this.nextRow();

      var currentSelection = nextRow.find('.block.block-default').get(pos - 1);

      $(currentSelection).setBlock().switchToSelectedBlock();
      this.currentSelection = $(currentSelection);
      return this;
    };

    Navigation.prototype.space = function(task) {
      this.currentTask = task || new Tasks().posAssociation(this, task);
      var task = this.currentTask;
      task.onSpaceKeydown.forEach(function(ev, c) {
        task[ev]();
      });
    };

    Navigation.prototype.enter = function() {
      var task = this.currentTask;
      task.onEnterKeydown.forEach(function(ev, c) {
        task[ev]();
      })
    };

    Navigation.prototype.layerUp = function() {

    };

    Navigation.prototype.layerDown = function() {

    };

    Navigation.prototype.nextRow = function() {
      var currentRow = this.currentSelection.parent('.container.grid-container')
        .next('.container.grid-container');
      if(! currentRow.length) currentRow = this.currentSelection.parent('.container.grid-container').siblings('.container.grid-container').first();

      this.prevRowElement = this.currentRow;
      this.currentRow = currentRow;
      return this.currentRow;
    };

    Navigation.prototype.prevRow = function() {
      var currentRow = this.currentSelection.parent('.container.grid-container')
        .prev('.container.grid-container');
      if(! currentRow.length) currentRow = this.currentSelection.parent('.container.grid-container').siblings('.container.grid-container').last();

      this.prevRowElement = this.currentRow;
      this.currentRow = currentRow;
      return this.currentRow;
    };

    var navigation = new Navigation($(this), $(this).find('.block.block-selected').first());
    navigation.init();
    return navigation;
  }; // end $setupNavigation
  $('.container.grid-container:has(.block.block-selected)').setupNavigation();
});