(function(Stack, $, undefined) {
    var TaskListPlugin = Stack.jQueryPlugins.BasePlugin.extend({
        'name': 'tasklist',
        'allow_multiple_instances': true,
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


            /**
             * Simple workflow...:
             * 1. build - build and prepare any DOM elements which are or may be needed by the component (jQ plugin)
             *  - called once
             * 2. events - bind/unbind any events...everything is IN the scope of the $element
             *  - called once
             * 3. refresh_ui - sync any .data() stuff w/ the presentation of the DOM elements
             *  - may be called multiple times
             */
            self.build();
            self.events();
            self.refresh_ui();
        },
        'build': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.

            self.$newtask = $('<a href="javascript:;" class="new">New Task</a>');
            $element.append(self.$newtask);

            self.$counter = $('<div></div>');
            $element.prepend(self.$counter);
        },
        'refresh_ui': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.




            $('.task', $element).each(function() {
                if($(this).data('task-obj')) {
                    $(this).task('refresh_ui');
                } else {

                    $(this).task();

                    var $task = $(this).task('get_instance');

                    console.log("Found new task: ", $task);

                    self.proxyEvent("task", "change", $task);
                    self.proxyEvent("task", "destroy", $task);
                    self.trigger('change', $task);
                }
            });

            self.$counter.text("You've got " + $('.task', $element).size() + " tasks.");
        },
        'events': function() {
            var self = this;
            var $element = $(self.element); // this is the element that we'd attached the plugin to.

            $element.delegate('.new', 'click', function(e) {
                var $task = $('<div class="task" data-name="Untitled"></div>');
                $('.new', $element).before(
                    $task
                );

                self.trigger('new', $task);
            });


            self.bind('task:change', function(e) {
                self.trigger('change', e.target);
            });
            self.bind('task:destroy', function(e) {
                self.trigger('destroy', e.target);
            });


            self.bind('change', function(e) {
                self.refresh_ui();
            });

            self.bind('new', function(e, $task) {
                console.log("task added: ", $task);
                self.refresh_ui();
            });
        }

    });

    Stack.jQueryPlugins.TaskListPlugin = TaskListPlugin; //dont init

    Stack.jQueryPlugins.register(TaskListPlugin);
})(window.Stack, jQuery);