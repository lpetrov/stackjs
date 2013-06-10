/**
 * Core for 'Stack'
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};

(function(Stack, $, undefined) {
    var jQueryPlugin = Stack.BaseComponent.extend({
        'name': 'jquery_plugin',
        'init': function() {
            return this._super();
        },
        'plugin': function(name, kls) {
            jQuery.fn[name] = function(method) {
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
        },
        'bootstrap': function(options) {
            Stack.BaseComponent.prototype.bootstrap.call(this, options);

            return $(this.element);
        }
    });

    Stack.jQueryPlugin = new jQueryPlugin(); //init
})(window.Stack, jQuery);