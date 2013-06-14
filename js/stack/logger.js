/**
 * Basic Logger Component
 *
 * User: lyubomirpetrov
 */

(function(Stack, undefined) {
    var Logger = Stack.BaseComponent.extend({
        'name': 'logger',
        'defaults': {
            'plugins': [
                'caller',
                'datetime'
            ],
            'enabled': true
        },
        'init': function(options) {
            this._super(options);
            return this;
        },
        'log': function() {
            var self = this;

            if(self.option('enabled', false)) {
                return;
            }
            var args = Array.prototype.slice.call( arguments, 0 );

            var pre_args = [];

            self.option('plugins', []).forEach(function(v, k) {

            });

            pre_args.push(caller);

            console.log.apply(console, pre_args.concat(args));
        },
        'plug_datetime': function(args) {
            var dt = new Date();
            args = [
                "[" + dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + "]"
            ].concat(args)
        },
        'plug_caller': function(args) {
            var caller = "";
            if(printStackTrace != undefined) {
                var stack = printStackTrace();
                caller = stack[4].replace(/^\s+at\s+/, "");
            } else {
                caller = arguments.callee.caller.name;
            }
            if(caller != "") {
                caller = "[" + caller + "]";
            }

            return caller;
        }

    });




    Stack.Logger = Logger; // init
})(window.Stack);