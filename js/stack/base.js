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
        'plugins': null,
        'init': function(options) {
             /** initialize options **/
            if(!this.defaults) {
                this.defaults = {}
            }

            if(options == undefined) {
                options = {}
            }

            this.options = $.extend(true, {}, this.defaults, Stack.Config.get(this.name), options);
            this.plugins = [];

            //TMI!
//            console.debug("Bootstraping component '" + this.name + "' w/ runtime configuration: ", this.options, " and runtime opts:", options)
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
        'is_bound': function(type, fn, dont_prefix) {
            var events = this[jQuery.expando].events;
            if(!dont_prefix) {
                type = this.name + ":" + type;
            }

            if(!events || !events[type]) {
                return false;
            }

            var data = events[type];


            if (data === undefined || data.length === 0) {
                return false;
            }

            var found = false;
            $.each(data, function(k, v) {
                if(v.handler.toString() == fn.toString()) {
                    found = true;
                    return false;
                }
            });

            return found;
        },
        'bind_once': function(type, fn) {
            var self = this;
            if(!self.is_bound(type, fn)) {
                self.bind(type, fn);
            } else {
//                console.log('will NOT bind, already bound:', type, fn);
            }
        },
        'trigger': function() {
            var args = Array.prototype.slice.call(arguments, 0);

            var event = null;
            if(args[0] instanceof jQuery.Event) {
                event = args[0];
            } else {
                args[0] = this.name + ":" + args[0];
                event = new jQuery.Event(args[0], {});
                args[0] = event;
            }

//            console.log("Triggering: ", event, args);
            $(this).trigger.apply($(this), args);

            return event;
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
        },
        'attachPlugin': function(p) {
            var self = this;
            self.plugins.push(p);
            p.trigger('plugin:attached', [self]);
        },
        'detachPlugin': function(p) {
            var self = this;
            var idx = self.plugins.indexOf(p);
            if(idx > -1) {
                delete self.plugins[idx];
            } else {
                console.error("Plugin not found: ", p);
                return false;
            }
            p.trigger('plugin:detached', [self]);

            return true;
        },
        'proxyEvent': function(prefix, event_name, target_component) {
            var self = this;
            target_component.bind(event_name, function() {
                var args = Array.prototype.slice.call(arguments);
                if(args[0] instanceof jQuery.Event) {
                    args[0].type = args[0].type.replace(target_component.name, self.name + ":" + prefix);
                } else {
                    args[0] = args[0].replace(target_component.name, self.name + ":" + prefix);
                }

//                console.log("Proxiying event: ", args);
                self.trigger.apply(self, args);
            })
        },
        'destroy': function() {
            $(this).unbind();
            $(this).removeData();
            delete this;
        }
    });

    Stack.BaseComponent = BaseComponent; //expose the base class component
})(window.Stack);