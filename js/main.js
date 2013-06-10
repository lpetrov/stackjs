(function(Stack) {
    /**
     * Bootstrap components manually here.
     */

    // this is Stack.
    // the goal of stack is to utilize and reuse code across different projects

    // stack currently includes:

    /**
     * Nothing interesting here..but some day we may add some core/util funcs that need to be executed before the other
     * components.
     */
    Stack.Core.bootstrap();

    /**
     * Some FB specific features (hacks/solutions, that can be enabled/disabled in the config)
     */
    Stack.Facebook.bootstrap();

    /**
     * Google Analytics tracking starts here.
     */
    Stack.GoogleAnalytics.bootstrap();

    /**
     * AddThis
     */
    Stack.AddThis.bootstrap();

    /**
     * Less Helper
     */
    Stack.Less.bootstrap();


    // So, the most interesting part comes here.
    // Simple and Prototype/OOP-ish way of defining jQuery plugins.

    /**
     * jQuery Plugin Helper demo
     */
    // with custom (per call) options
    $('.hello_world').hello_world({
        'name': 'Lyubo' //overwritten on demand, when initializing.
    });

    // with default options (check your config for global per env. overwrites)
//    $('.hello_world').hello_world(); // lets test this


})(window.Stack);