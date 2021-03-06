define([
    'jquery',
    'Underscore',
    'io/snapnote/app/Tool',
    'io/snapnote/graphics/tools/Image'
  ],
  function($, _, Tool, Image) {

    var ImageTool = function(triggerSelector, fileSelector, stage) {
      this.selector = triggerSelector;
      this.stage = stage;

      var $fileSelector = $(fileSelector);

      // When the real thing is clicked, route it to
      // the file selector
      $(triggerSelector).click(_.bind(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $fileSelector.click();
      }, this));

      $fileSelector.change(_.bind(this._onFileSelectorChange, this));
    }

    ImageTool.prototype = _.extend(new Tool(), {
      /**
       * @property eventName
       * @type String
       */
      eventName: 'image_add',

      onClickTrigger: function(event) {
        ga('send', 'event', 'annotation', this.eventName + '_select', null, null, false);

      },

      _onFileSelectorChange: function(event) {
        ga('send', 'event', 'annotation', this.eventName, null, null, false);

        var files = $(event.target).prop('files');
        _.each(files, _.bind(function(file) {
          var reader = new FileReader();
          reader.onload = (function(file, stage) {
              return function(event) {
                var image =
                  new Image(event.currentTarget.result);

                image.addEventListener('load', function(event) {
                  image.set({
                    x: (stage.width/2 - ((image.width * image.scale)/2)) + (Math.random()*50 - 25),
                    y: (stage.height/2 - ((image.height * image.scale)/2)) + (Math.random()*50 - 25)
                  });
                  stage.update();
                });

                // Add it to the stage as it loads
                stage.addStageObject(image);
              }
            })(file, this.stage);
          reader.readAsDataURL(file);
        }, this));
      },

      newStageObject: function() {
        var image = new Image('/img/beautiful/lazyButAlive.jpg');

        // Update the stage a second time after the image
        // finishes loading
        image.addEventListener('load', function(event) {
          image.getStage().update();
        });

        return image;
      }
    });

    return ImageTool;
  }
);
