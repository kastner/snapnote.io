define([
    'jquery',
    'Underscore'
  ],
  function($, _) {
    var Tool = function() {
      Object.defineProperty(this, 'color', {
        get: this.getColor.bind(this),
        set: this.setColor.bind(this)
      });
      Object.defineProperty(this, 'shadowColor', {
        get: this.getShadowColor.bind(this),
        set: this.setShadowColor.bind(this)
      });
      Object.defineProperty(this, 'stage', {
        get: this.getStage.bind(this),
        set: this.setStage.bind(this)
      });
      Object.defineProperty(this, 'selector', {
        get: this.getSelector.bind(this),
        set: this.setSelector.bind(this)
      });
    }

    Tool.prototype = {
      _color: '#000',
      _shadowColor: '#fff',
      _stage: null,
      _selector: null,

      /**
       * @property stage
       * @type Stage
       */
      getColor: function() { return this._color; },
      setColor: function(color) {
        this._color = color;
        this.trigger.find('.icon').css('color', color);
      },

      /**
       * @property stage
       * @type Stage
       */
      getShadowColor: function() { return this._shadowColor; },
      setShadowColor: function(color) {
        this._shadowColor = color;
        this.trigger.find('.icon').css('text-shadow',
          '1px 2px 1px ' + color);
      },

      /**
       * @property stage
       * @type Stage
       */
      getStage: function() { return this._stage; },
      setStage: function(stage) {
        this._stage = stage;
      },

      /**
       * @property selector
       * @type String
       */
      getSelector: function() { return this._selector; },
      setSelector: function(selector) {
        // If we already have a trigger, unbind it
        if (this.trigger) {
          this.trigger.unbind('click');
        }

        this._selector = selector;
        this.trigger = $(selector);

        // Listen for click events on the trigger
        this.trigger.click(_.bind(this.onClickTrigger, this));
      },

      /**
       * @property trigger
       * @type jQuery
       */
      trigger: null,

      /**
       * Tools extending this must override this function
       *
       * @return StageObject
       * A new StageObject to be added to the Stage
       */
      newStageObject: function() {
        console.error('newStageObject must be overridden', this);
      },

      addObjectToStage: function(event) {
        var stageObject = this.newStageObject(event);
        stageObject = _.extend(stageObject, {
          color: this.color,
          shadowColor: this.shadowColor,
          x: (this.stage.width/2) - (stageObject.width*stageObject.scale/2) + (Math.random()*50 - 25),
          y: (this.stage.height/4) - (stageObject.height*stageObject.scale/2) + (Math.random()*50 - 25)
        });
        this.stage.addStageObject(stageObject);

        stageObject.selected = true;

        this.stage.update();
      },

      /**
       * Listener for when the trigger is clicked
       */
      onClickTrigger: function(event) {
        ga('send', 'event', 'annotation', this.eventName, null, null, false);

        this.addObjectToStage(event);
      }
    };

    return Tool;
  }
);
