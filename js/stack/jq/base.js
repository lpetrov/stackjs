/**
 * Base helper plugin for jQuery using Stack's jQuery plugin framework.
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
Stack.jQueryPlugins = Stack.jQueryPlugins || {};

(function(Stack, $, undefined) {
    var BasePlugin = Stack.BaseComponent.extend({
        //TODO: Name and allow_multiple... should be static!
        'name': 'jq_base',
        'allow_multiple_instances': true,
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

             this._super();
         },
        'element_exists': function() {
            return $('#' + this.element.attr('id')).size() > 0;
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

                var is_new_instance = true;
                if($this.data(name + "-obj")) {
                    instance = $this.data(name + "-obj");
                    is_new_instance = false;
                } else {

                }

                // Method calling logic
                if (method != undefined && !jQuery.isPlainObject(method) && instance[method] != undefined) {
                    return instance[ method ].apply( instance, Array.prototype.slice.call( arguments, 1 ));
                } else if ( jQuery.isPlainObject(method) || ! method ) {
                    if($this.length == 1) {
                        if(!is_new_instance && kls.prototype.allow_multiple_instances == false) { // halt
                            console.warn(name + ": this plugin does not allow multiple instances.");
                            return $this;
                        }

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
