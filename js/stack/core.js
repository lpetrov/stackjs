/**
 * Core for 'Stack'
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};

(function(Stack, $, undefined) {
    var Core = Stack.BaseComponent.extend({
        'init': function() { // base OOP/Prototype architecture for defining, loading, initializing and configuring
                             // components
            this._super();

            this._detect_paths();

            this._do_patching();
        },
        /**
         * Auto detects paths to stack.
         */
        '_detect_paths': function() {
            $('script').each(function() {
                var src = $(this).attr("src");
                if(src && src.indexOf("/stack/core.js") > -1) {
                    var orig_src = $(this).attr("src")
                    this.base_stack_path = orig_src.replace("/core.js", "/");
                    this.base_js_path = orig_src.replace("/stack/core.js", "/");

                    return false; //break
                }
            });
        },

        /**
         * Helper function that will be used some day for exporting and minifying resources.
         * @return {Object}
         */
        'export_resources': function() {
            var scripts = [];
            $('script').each(function() {
                var src = $(this).attr('src');
                if(src && src.indexOf("//") != 0 && src.indexOf("http") != 0) {
                    scripts.push($(this).attr('src'))
                }
            });

            var styles = [];
            $('link').each(function() {
                var src = $(this).attr('href');
                if(src && src.indexOf("//") != 0 && src.indexOf("http") != 0) {
                    styles.push($(this).attr('href'))
                }
            });

            return {
                'styles': styles,
                'scripts': scripts
            }
        },
        '_do_patching': function() {
            String.prototype.pxToInt = function() {
                return new Number(this.replace("px", ""));
            }
        }
    });

    Stack.Core = new Core(); //init
})(window.Stack, jQuery);