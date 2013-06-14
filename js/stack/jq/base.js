/**
 * Base helper plugin for jQuery using Stack's jQuery plugin framework.
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
Stack.jQueryPlugins = Stack.jQueryPlugins || {};

(function(Stack, $, undefined) {
    var BasePlugin = Stack.BaseComponent.extend({
        'name': 'jq_base',
        'element': null,
        'init': function(options) {
            if(options == undefined) {
                options = {};
            }
            if(options['element'] == undefined) {
                throw new Error("Can initialize jQuery plugin w/ missing target element");
            }
            // override with higher priority all options from the data attributes
            options = $.extend(
                true,
                options,
                $(options['element']).data()
            );


            //TODO: ?
            // Stack.jQueryPlugin.plugin(this.name, this);

            this.element = options['element'];

            this._super(options);
        },
         'get_instance': function() {
            return jQuery(this.element).data(this.name + "-obj");
         },
         'destroy': function() {
             var self = this;

             if(jQuery.isFunction(self.destroy_instance)) {
                 self.destroy_instance();
             }
             jQuery(self.element).removeData(self.name + "-obj");
         }
    });
    Stack.jQueryPlugins.BasePlugin = BasePlugin; //init

    Stack.jQueryPlugins.register = function(kls) {
        var name = kls.prototype.name;

        jQuery.fn[name] = function(method) {
                var instance,
                    $this = jQuery(this);

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

                }

                // Method calling logic
                if (method != undefined && !jQuery.isPlainObject(method) && instance[method] != undefined) {
                    return instance[ method ].apply( instance, Array.prototype.slice.call( arguments, 1 ));
                } else if ( jQuery.isPlainObject(method) || ! method ) {
                    if($this.length == 1) {

                        //default settings impl.

                        var args = Array.prototype.slice.call( arguments, 0 );
                        if(args.length == 0)
                            args[0] = {};

                        args[0].element = $($this);

                        instance = new kls(args[0]);
                        $this.data(name + "-obj", instance);

                        return $this;
                    }
                } else {
                    jQuery.error( 'Method ' +  method + ' does not exist on jQuery.fn.' + name );
                }
            }
    }


})(window.Stack, jQuery);
