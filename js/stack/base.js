/**
 * Core for 'Stack'
 *
 * User: lyubomirpetrov
 */

/** patch console.* first (IE...) **/

(function() {
    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function() {};
        }
    }
})();


window.Stack = window.Stack || {};

(function(Stack, undefined) {
    var BaseComponent = Class.extend({
        'name': 'base_component',
        'defaults': null,
        'init': function() {
            // pass

            return this;
        },
        'bootstrap': function(options) {
            /** initialize options **/
            if(!this.defaults) {
                this.defaults = {}
            }

            if(options == undefined) {
                options = {}
            }

            this.options = $.extend({}, this.defaults, Stack.Config.get(this.name), options);

            console.log("Bootstraping plugin '" + this.name + "' w/ runtime configuration: ", this.options, " and runtime opts:", options)

            return this;
        },
        'option': function(name, default_value) {
            if(name == undefined) {
                return $.extend({}, this.options);
            }

            if(!this.options[name]) {
                return default_value;
            } else {
                return this.options[name];
            }
        }
    });

    Stack.BaseComponent = BaseComponent; //expose the base class component
})(window.Stack);