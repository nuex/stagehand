(function($) {

  var Step = function(name, mode, position, fn){
    this.name = name;
    this.mode = mode;
    this.callback = fn;
    this.position = position;
  };

  var StepNotFoundException = function(name, mode){
    console.log('step [name: ' + name + ' mode: ' + mode + '] not found');
  };

  $.stagehand = {

    steps: [],

    currentPosition: null,

    start: function() {
      var target = $.stagehand.steps[0];
      $.stagehand.process(target);
    },

    stage: function(name, mode){
      var target = $.stagehand.find(name, mode);
      $.stagehand.process(target);
    },

    process: function(target) {

      if(target.position == $.stagehand.currentPosition) return;

      (target.position > $.stagehand.currentPosition) ? incrementPosition() : decrementPosition();

      var step = $.stagehand.steps[$.stagehand.currentPosition];

      // here's where the shizzle happens
      step.callback();

      $.stagehand.process(target);

      function incrementPosition() {
        if($.stagehand.currentPosition == null) {
          $.stagehand.currentPosition = 0;
        } else {
          $.stagehand.currentPosition = $.stagehand.currentPosition + 1;
        }
      }

      function decrementPosition() {
        if($.stagehand.currentPosition == null) {
          $.stagehand.currentPosition = 0;
        } else {
          $.stagehand.currentPosition = $.stagehand.currentPosition - 1;
        }
      }

    },

    setup: function(name) {
      $.stagehand.stage(name, 'up');
    },

    teardown: function(name) {
      $.stagehand.stage(name, 'down');
    },

    add: function(name, modes){
      var position = $.stagehand.steps.length
      var step_down = new Step(name, 'down', position, modes['down']);
      $.stagehand.steps.push(step_down);

      position = $.stagehand.steps.length
      var step_up = new Step(name, 'up', position, modes['up']);
      $.stagehand.steps.push(step_up);
    },

    find: function(name, mode) {
      var step = null;
      $.each($.stagehand.steps, function(i,current){
        if(current.name == name && current.mode == mode) {
          step = current;
          return;
        }
      });
      if(step){
        return step;
      } else {
        throw new StepNotFoundException(name, mode);
      }
    }

  };

})(jQuery);
