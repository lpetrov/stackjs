(function(Stack, $, undefined) {
    var TaskPlugin = Stack.jQueryPlugins.BasePlugin.extend({
        'name': 'task',
        'allow_multiple_instances': false,
        'defaults': {
        },
        /**
         * Defined in the same way as a Stack Component, but acts as a jQuery plugin.
         *
         * @param options
         */
        'init': function(options) {
            this._super(options);

            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.


            self.build();
            self.events();
            self.refresh_ui();
        },
        /**
         * Can be called multiple times...when the data had changed.
         */
        'refresh_ui': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.



            self.$name.val(
                self.data('name')
            );
            self.$done.attr('checked', self.data("checked") ? true : false);

            if(self.data('color')) {
                self.$color.val(self.data('color'));
                self.$name.css({
                    'color': self.data('color')
                });
            }


        },
        /**
         * Called once...to build the initial Component markup.
         */
        'build': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.

            $element.empty(); // reset, we want to RE-render

            self.$delete = $('<a href="javascript:;" class="delete">Delete</a>');
            self.$name = $('<input name="name" value="" type="text" />');
            self.$color = $('<input name="color" value="" type="color" />');
            self.$done = $('<input name="done" value="1" type="checkbox" />');
            self.$container = $('<div class="task-container"></div>');


            self.$container
                .append(self.$done)
                .append(self.$color)
                .append(self.$name)
                .append(self.$delete);

            $element.append(self.$container);

        },
        'events': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.


            // dom events
            $element.delegate('.delete', 'click', function(e) {
                console.log("removed");

                self.destroy();
            });

            $element.delegate('input[name="name"]', 'change', function(e) {
                self.data('name', $(this).val());
            });

            $element.delegate('input[name="color"]', 'change', function(e) {
                self.data('color', $(this).val());
            });

            $element.delegate('input[name="done"]', 'change', function(e) {
                console.log("done changed");

                if($(this).is(":checked")) {
                    self.data('checked', 1);
                } else {
                    self.removeData('checked');
                }
            });


            // component events
            self.bind('change', function() {
                self.refresh_ui();
            });
        }

    });

    Stack.jQueryPlugins.TaskPlugin = TaskPlugin; //dont init

    Stack.jQueryPlugins.register(TaskPlugin);
})(window.Stack, jQuery);
