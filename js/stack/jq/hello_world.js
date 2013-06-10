/**
 * Hello World - Demo plugin for jQuery using Stack's jQuery plugin framework.
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
Stack.jQueryPlugins = Stack.jQueryPlugins || {};

(function(Stack, $, undefined) {
    var HelloWorldPlugin = Stack.jQueryPlugins.BasePlugin.extend({
        'name': 'hello_world',
        'defaults': {
            'name': 'Anonymous'
        },
        /**
         * Defined in the same way as a Stack Component, but acts as a jQuery plugin.
         *
         * @param options
         */
        'bootstrap': function(options) {
            Stack.jQueryPlugins.BasePlugin.prototype.bootstrap.call(this, options);

            var self = this,
                $element = $(self.element); // this is the element that we'd attached the plugin to.

            $element.on('click', function() {
                // since this is a Stack component all options are;
                // 1. Inherited the same way as all components.
                // 2. Can be defined when calling .bootstrap({...})
                // 3. With good defaults

                // self.option() can be easily used to read options (jQuery call these settings)
                $element.text('Hello world ' + self.option('name') + ' (rand #' + rand(0, 1000) + ")!");
            });


            $element.triggerHandler('click');
        }
    });

    Stack.jQueryPlugins.HelloWorldPlugin = new HelloWorldPlugin(); //dont init
})(window.Stack, jQuery);
