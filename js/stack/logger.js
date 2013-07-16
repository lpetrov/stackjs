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
        'E_WARN': 'warn',
        'E_DIR': 'dir'
    };

    var Logger = Stack.BaseComponent.extend({
        'name': 'logger',
        'defaults': {
            'plugins': [
                'caller',
                'datetime'
            ],
            'logger': null,
            'filters':{},
            'enabled': true,
            'events-enabled': true,

            /**
             * This will patch the window.console with an instance of the logger. Watch out, use this only in emergency.
             */
            'autopatch': false
        },
        'events': Object.values(LOG_LEVELS),
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
            if(self.option('autopatch', false) == true) {
                window.console = self;
            }
            return this;
        },
        /**
         * Return the currently configured logger that you want to call. e.g. something different then window.console.
         *
         * @returns {*}
         */
        'get_logger': function() {
            var self = this;
            if(self.option('logger') == null) {
                return window.console;
            }
        },
        'log': function() {
            var self = this;

            if(self.option('enabled', false) == false) {
                self.get_logger().log("Logger is disabled.")
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

            if(self.option('events-enabled', false) == true) {
                var event = jQuery.Event("logger:" + log_level);
                self.trigger(event, [args]);
                if (event.isDefaultPrevented()) {
                    return;
                }
            }
            //cordova, android fix
            if(window.location.toString().indexOf("android_asset") > -1) {
                args = [args.join(", ")];
            }

            var l = self.get_logger();
            l[log_level].apply(l, args);
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
                var stack = printStackTrace({
                    guess: true
                });
                var found_stack = stack[stack.length - 3];
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




    Stack.Logger = Logger; // expose
})(window.Stack);