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
        'init': function() {
            this._super();

            return Stack.jQueryPlugin.plugin(this.name, this);
        },
        'bootstrap': function(options) {
            // override with higher priority all options from the data attributes
            options[0] = $.extend(
                true,
                options[0],
                $(options[0]['element']).data()
            );

            return Stack.BaseComponent.prototype.bootstrap.apply(this, options);
        },
        'destroy': function() {
            // abstract.
        }
    });

    Stack.jQueryPlugins.BasePlugin = BasePlugin; //init
})(window.Stack, jQuery);
