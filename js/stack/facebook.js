/**
 * Facebook Initializer
 *
 * User: lyubomirpetrov
 */

(function(Stack, undefined) {
    var fb_is_loaded = false;

    var Facebook = Stack.BaseComponent.extend({
        'name': 'facebook',
        'defaults': {
            'container_element': '.wrapper',
            'min_height': 640,
            'overflow_body_when_in_iframe': true,
            'scroll_on_reload': true
        },
        'init': function() {
            this._super();

            /**
             * We can later attach other plugins that are related to FB to this event (jQuery Custom Events)
             */
            $(this).on('fb_loaded', this.on_fb_loaded);
        },
        /**
         * Bootstraps Stack.Facebook.
         * Loads FB in Async mode.
         * Takes care of autoheight/grow functionality better then the one in FB.Canvas.setAutoGrow()...
         * Takes care of switching the dev/staging/production App IDs (inherited feature from the Config component)
         *
         * @param options
         */
        'bootstrap': function(options) {
            Stack.BaseComponent.prototype.bootstrap.call(this, options);


            console.debug("Facebook: Initializing with configuration", this.options);

            $('body').append('<div id="fb-root"></div>');

            var stack_fb = this;

            window.fbAsyncInit = function() {
                // init the FB JS SDK
                FB.init({
                    appId      : stack_fb.option("app_id"), // App ID from the App Dashboard
                    channelUrl : '//' + window.location.host + '/channel.html', // Channel File for x-domain communication
                    status     : true, // check the login status upon init?
                    cookie     : true, // set sessions cookies to allow your server to access the session?
                    xfbml      : true  // parse XFBML tags on this page?
                });

                // Additional initialization code such as adding Event Listeners goes here

                fb_is_loaded = true;

                $(stack_fb).trigger('fb_loaded');
            };


            setInterval(function() {
                if(fb_is_loaded && top !== self /* we are in iframe */) {
                    FB.Canvas.setAutoGrow(true);

                    var min_height = stack_fb.option('min_height');

                    FB.Canvas.setSize({
                        height: $('body').outerHeight() < min_height ? min_height : $('body').outerHeight()
                    });

                    if(stack_fb.option('overflow_body_when_in_iframe', false)) {
                        $("html, body").css("overflow", "hidden");
                    }
                }
            }, 100);


            this.inject_fb_js();
        },
        /**
         * Load FB in async mode. Auto called by the bootstrap() method
         */
        'inject_fb_js': function() {
            console.log("Facebook: Injecting FB's JS.");

            // Load the SDK's source Asynchronously
            (function(d){
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            }(document));
        },
        /**
         * Implements scroll on load and auto resizing of the iframe, w/ support for minimum height
         */
        'on_fb_loaded': function() {
            console.debug("Facebook: Loaded");

            if(top !== self) { // we are in an iframe
                console.debug("Facebook: Setting autogrow");
                FB.Canvas.setAutoGrow();

                if(typeof(FB.Canvas) != 'undefined' && this.option("scroll_on_reload", false) === true) {
                    console.debug("Facebook: Scroll to top.");
                    FB.Canvas.scrollTo(0,0);
                }

                var $fb_container_element = $(this.option('container_element'));

                var size = {
                    width: $fb_container_element.outerWidth(),
                    height: $fb_container_element.outerHeight()
                };

                console.debug("Facebook: Manually set the size to: ", size);

                FB.Canvas.setSize(size);
            }
        },

        /**
         * Helper func that will be called from the Chrome console to add this app as Fb Page Tab.
         */
        'add_to_page': function() { // cos' we are too lazy and we love to use the js console!
            window.open('https://www.facebook.com/dialog/pagetab?app_id=' + this.option("app_id") +
                '&display=popup&next=' + escape(window.location), "_blank");
        }
    });




    Stack.Facebook = new Facebook(); // init
})(window.Stack);