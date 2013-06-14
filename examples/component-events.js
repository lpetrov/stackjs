/**
 * Example: Stack.BaseComponent
 *
 * Example of several simple event handling (based on jQuery's event model!)
 */
(function(Stack) {
    Stack.Config.bootstrap({
        'environments': {
            'order': ['order'],
            'dev': ['']
        },
        'dev': {}
    }); /* no need to initialize anything */
    window.logger = new Stack.Logger(/* default options */);


    logger.one('info', function(e, args) {
        args.push("[this message is appended using events]");
    });


    // test it
    logger.log("don't append me");
    logger.info("append me");

    // skip next message
    logger.one('info', function(e, args) {
        e.preventDefault();
        // you can also use:
//        return false;
    });
    logger.info('this message will be omitted');

})(Stack, undefined);