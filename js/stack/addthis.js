/**
 * Simple Add This Integration
 *
 * User: lyubomirpetrov
 */

(function(Stack, $, undefined) {

    var AddThis = Stack.BaseComponent.extend({
        'name': 'addthis',
        'defaults': {
            'track_social_shares': true,
            'pubid': 'ra-XXXXXXXX',
            'ui_click': true
        },
        'init': function() {
            this._super();
        },
        /**
         * Simple AddThis component.
         * Supports:
         *  - Passing config options (per environment) to the real AddThis Client API
         *  - Google Analytics Integration
         *  - Track Social
         *  - Twitter template
         *
         * @param options
         */
        'bootstrap': function(options) {
            Stack.BaseComponent.prototype.bootstrap.call(this, options);


            addthis_config = $.extend({}, this.options);

            if(Stack.GoogleAnalytics.option("id", false)) {
                addthis_config['data_ga_property'] = Stack.GoogleAnalytics.option("id");

                if(this.option('track_social_shares', false)) {
                    addthis_config['data_ga_social'] = true;
                }

                if(this.option('twitter_template', false)) {
                    addthis_config['templates']['twitter'] = this.option('twitter_template');
                }
            } else {
                throw new Error("GoogleAnalytics not bootstrapped or missing tracking ID.");
            }

            addthis_share = $.extend({}, addthis_config);

            console.debug("AddThis: Initialized with configuration: ", this.options, addthis_config);

            this.inject_addthis_js();

        },
        'inject_addthis_js': function() {
            console.log("AddThis: Injecting AddThis's JS.");
            var self = this;

            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=('https:'==location.protocol?'//':'//')+'s7.addthis.com/js/300/addthis_widget.js#pubid=' + self.option('pubid') + '&domready=1';
                s.parentNode.insertBefore(g,s)}(document,'script'));
        }
    });




    Stack.AddThis = new AddThis(); // init
})(window.Stack, jQuery);