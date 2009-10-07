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
      if($.stagehand.currentPosition == null) {
        startPosition();
      } else if(target.position > $.stagehand.currentPosition) {
        incrementPosition();
      } else {
        decrementPosition();
      }

      var step = $.stagehand.steps[$.stagehand.currentPosition];

      // here's where the shizzle happens
      step.callback();

      $.stagehand.process(target);

      function startPosition() {
        $.stagehand.currentPosition = 0;
      }

      function incrementPosition() {
        $.stagehand.currentPosition = $.stagehand.currentPosition + 1;
      }

      function decrementPosition() {
        $.stagehand.currentPosition = $.stagehand.currentPosition - 1;
      }

    },

    setup: function(name) {
      $.stagehand.stage(name, 'up');
    },

    teardown: function(name) {
      $.stagehand.stage(name, 'down');
    },

    add: function(name, modes){
      $.each(['down', 'up'], function(i, mode){
        var position = $.stagehand.steps.length;
        var step = new Step(name, mode, position, modes[mode]);
        $.stagehand.steps.push(step);
      });
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
