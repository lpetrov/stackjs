/**
 * Less Initializer
 *
 * User: lyubomirpetrov
 */

(function(Stack, undefined) {
    var Less = Stack.BaseComponent.extend({
        'name': 'less',
        'defaults': {
            'environment': 'development',
            'watch': true
        },
        'init': function() {
            this._super();
        },
        /**
         * Initializes Less.
         * Supports:
         *  - Switching configuration (environment) using our internal Config mechanism (Stack.Config)
         *
         * @param options
         */
        'bootstrap': function(options) {
            Stack.BaseComponent.prototype.bootstrap.call(this, options);


            console.debug("Less: Initializing with configuration", this.options);

            $.extend(less, {
                'env': this.option('environment', 'development'),
                'watchMode': false
            });

            // This does not work in 1.3.1 (damn!)
//            if(this.option('watch', false)) {
//                console.debug("Less: watch mode is on.");
//                less.watch();
//            };
        }
    });

    Stack.Less = new Less(); // init
})(window.Stack);