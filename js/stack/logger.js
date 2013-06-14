/**
 * Basic Logger Component
 *
 * User: lyubomirpetrov
 */

(function(Stack, undefined) {
    var LOG_LEVELS = {
        'E_ERROR': 'error',
        'E_INFO': 'info',
        'E_DEBUG': 'debug',
        'E_WARN': 'warn'
    };

    var Logger = Stack.BaseComponent.extend({
        'name': 'logger',
        'defaults': {
            'plugins': [
                'caller',
                'datetime'
            ],
            'filters':{},
            'enabled': true
        },
        'init': function(options) {
            this._super(options);

            var self = this;

            Object.keys(LOG_LEVELS).forEach(function(k) {
                var v = LOG_LEVELS[k];
                self[v] = function() {
                    var args = Array.prototype.slice.call( arguments, 0 );
                    self.log.apply(
                        self,
                        [k].concat(args)
                    );
                }
            });
            return this;
        },
        'log': function() {
            var self = this;

            if(self.option('enabled', false) == false) {
                console.log("Logger is disabled.")
                return;
            }
            var args = [];
            var log_level = arguments[0];
            if(log_level && LOG_LEVELS[log_level]) {
                args = Array.prototype.slice.call(arguments, 1, arguments.length);
                log_level = LOG_LEVELS[log_level];
            } else {
                log_level = "log";
                args = Array.prototype.slice.call(arguments, 0);
            }

            self.option('plugins', []).forEach(function(v, k) {
                if(self["plugin_" + v] != undefined) {
                    args = self["plugin_" + v].call(self, args);
                }
            });


            var filters = self.option('filters');
            var filter_found = false;
            Object.keys(filters).forEach(function(k) {
                var filter_cb = filters[k];
                if(filter_cb && filter_cb != false) { // disabled filter?
                    if(filter_cb(log_level, args) == false) {
                        filter_found = true;
                        return false;
                    }
                }
            });

            if(filter_found) {
                return;
            }

            console[log_level].apply(console, args);
        },
        'plugin_datetime': function(args) {
            var dt = new Date();
            return [
                "[" + dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + "]"
            ].concat(args);
        },
        'plugin_caller': function(args) {
            var caller = "";
            if(printStackTrace != undefined) {
                var stack = printStackTrace();
                var found_stack = "";

                stack.forEach(function(v, k) {
                    /**
                     * Hardcoding strings is not a good idea, but ... maybe I can find a better solution some day.
                     */
                    if(v.indexOf("Class.Stack.BaseComponent.extend.log") > -1) {
                        found_stack = stack[k+1];
                        if(found_stack.indexOf("Class.Stack.BaseComponent.extend.init.Object.keys.forEach.self") > -1) {
                            found_stack = stack[k+2];
                        }
                        return false;
                    }
                });
                caller = found_stack.replace(/^\s+at\s+/, "");
            } else {
                caller = arguments.callee.caller.name;
            }
            if(caller != "") {
                caller = "[" + caller + "]";
            }

            return [caller].concat(args);
        }

    });




    Stack.Logger = Logger; // init
})(window.Stack);