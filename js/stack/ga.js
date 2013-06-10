/**
 * Google Analytics Integration
 *
 * User: lyubomirpetrov
 */

(function(Stack, $, undefined) {

    var GoogleAnalytics = Stack.BaseComponent.extend({
        'name': 'ga',
        'defaults': {
            'track_outbound_links': true
        },
        'init': function() {
            this._super();
        },
        /**
         * Bootstrap Google Analytics.
         * Supports:
         *  - Tracking ID switching, per env (inherited feature from the Stack.Config)
         *  - Tracking outbound (external) links.
         *  - console.log is called so that custom event tracking can be easily debugged and verified by the developer
         *
         * @param options
         */
        'bootstrap': function(options) {
            Stack.BaseComponent.prototype.bootstrap.call(this, options);

            console.debug("GA: Initializing.");

            window._gaq = []
            this.exec('_setAccount', this.option('id'));
            this.exec('_trackPageview');

            this.inject_ga_js();

            if(this.option("track_outbound_links", false)) {
                this.track_outbound_links();
            }
        },
        'inject_ga_js': function() {
            console.log("GA: Injecting GA's JS.");

            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
                s.parentNode.insertBefore(g,s)}(document,'script'));
        },
        'exec': function() {
            var args = [].splice.call(arguments,0);

            console.log("GA command:", args);

            _gaq.push(args)
        },
        'track_outbound_links': function() {
            var self = this;
            $("a").bind('click',function(e){
                var url = $(this).attr("href");
                if (
                    url.indexOf("addthis.") == -1 &&
                    url.indexOf("javascript:;") == -1 &&
                    url.indexOf("#") != 0 &&
                    e.currentTarget.host != window.location.host
                ) {

                    self.exec('_trackEvent', 'Outbound Links', e.currentTarget.host, url, 0);

                    var target = $(this).attr("target");


                    if (e.metaKey || e.ctrlKey || target=="_blank") {
                        var newtab = true;
                    }
                    if (!newtab) {
                        e.preventDefault();
                        setTimeout('document.location = "' + url + '"', 100);
                    }
                }
            });
        }
    });




    Stack.GoogleAnalytics = new GoogleAnalytics(); // init
})(window.Stack, jQuery);