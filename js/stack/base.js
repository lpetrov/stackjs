/**
 * Core for 'Stack'
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};

(function(Stack, undefined) {
    var BaseComponent = Class.extend({
        'name': 'base_component',
        'defaults': null,
        'init': function(options) {
             /** initialize options **/
            if(!this.defaults) {
                this.defaults = {}
            }

            if(options == undefined) {
                options = {}
            }

            this.options = $.extend({}, this.defaults, Stack.Config.get(this.name), options);

            console.log("Bootstraping component '" + this.name + "' w/ runtime configuration: ", this.options, " and runtime opts:", options)
        },
        'option': function(name, default_value) {
            if(name == undefined) {
                return $.extend({}, this.options);
            }

            var result = get_value_from_array_path(this.options, name);

            if(!result) {
                return default_value;
            } else {
                return result;
            }
        },
        'bind': function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args[0] = this.name + ":" + args[0];
            return $(this).bind.apply($(this), args);
        },
        'trigger': function() {
            var args = Array.prototype.slice.call(arguments, 0);
            if(args[0] instanceof jQuery.Event) {
                // pass
            } else {
                args[0] = this.name + ":" + args[0];
            }
            return $(this).trigger.apply($(this), args);
        },
        'unbind': function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args[0] = this.name + ":" + args[0];
            return $(this).unbind.apply($(this), args);
        },
        'one': function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args[0] = this.name + ":" + args[0];
            return $(this).one.apply($(this), args);
        }
    });

    Stack.BaseComponent = BaseComponent; //expose the base class component
})(window.Stack);