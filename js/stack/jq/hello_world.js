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
        },
        'register_plugin': function() {
            jQuery.fn[this.name] = function(method) {
                var instance,
                    $this = jQuery(this);

                if(!(kls instanceof Stack.BaseComponent)) {
                    throw new Error("The jQuery plugin must be an instance of Stack.BaseComponent");
                }

                if($this.length > 1) {
                    var args = Array.prototype.slice.call( arguments, 0 );
                    $this.each(function() {
                        jQuery(this)[name].apply(this, args);
                    });
                    return;
                }


                if($this.data(name + "-obj")) {
                    instance = $this.data(name + "-obj");
                } else {
                    instance = jQuery.extend({},
                    {
                        'name': name,
                        'get_instance': function() {
                            return jQuery(this.element).data(name + "-obj");
                        },
                        'option': function(name, default_value) {
                            return jQuery(this.element).data(name + "-obj").option(name, default_value);
                        },
                        'destroy': function() {
                            if(jQuery.isFunction(instance.destroy_instance)) {
                                instance.destroy_instance();
                            }
                            jQuery(this).removeData(name + "-obj");
                        }
                    }, kls);
                    instance.element = $($this);
                    $this.data(name + "-obj", instance);
                }

                // Method calling logic
                if (method != undefined && instance[method] ) {
                    return instance[ method ].apply( instance, Array.prototype.slice.call( arguments, 1 ));
                } else if ( jQuery.isPlainObject(method) || ! method ) {

                    if($this.length == 1) {
                        //default settings impl.

                        var args = Array.prototype.slice.call( arguments, 0 );
                        if(args.length == 0)
                            args[0] = {};

                        console.debug("Initializing jQuery plugin '" + instance.name + "' for element: ", $this)
                        args[0].element = $($this);

                        //call with the final settings
                        return instance.bootstrap.call( instance, args );
                    }
                } else {
                    jQuery.error( 'Method ' +  method + ' does not exist on jQuery.fn.' + name );
                }
            }
        }
    });

    Stack.jQueryPlugins.HelloWorldPlugin = HelloWorldPlugin; //dont init
})(window.Stack, jQuery);
