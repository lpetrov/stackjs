/**
 * Example: Stack.jQueryPlugins
 *
 * Example of building a complex UI, with less, simple and readable code.
 */

// activate.js
(function(Stack) {
    $(document).ready(function() {
        Stack.Config.bootstrap({
            'environments': {
                'order': ['dev'],
                'dev': [
                    '' /* <- '' means file:// */
                ]
            },
            'dev': {}
        }); /* no need to initialize anything */


        // init UI components
        $('.tasklist').tasklist();


// $('.tasklist').tasklist();
    });
})(Stack, undefined);