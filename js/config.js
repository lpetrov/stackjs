/**
 * Using this (app specific) configuration, we can easily switch per environment and component settings.
 * Since all of the components manually bootstrapped after this config has been initialized, the developer have 3
 * possibilities of defining configuration options.
 *
 * 1. Every component can have it's own default values (following the pattern for 'good defaults')
 * 2. Every component's settings can be overwritten in this config. Every environment can inherit settings from the
 * parent env. Env inheritance is defined in `environments.order`.
 * 3. Every component can be bootstrapped with different options
 *
 * User: lyubomirpetrov
 */


(function(Config) {
    var config = {
        /**
         * Define domain environments
         *
         * 'order' - the order of inheritance
         * 'env_name' - must contain a list of domains that will be used for this environment
         */
        'environments': {
            'order': ['dev', 'staging', 'production'],
            'dev': [ // hosts for dev env.
                'stack.dev'
            ],
            'production': [ // hosts for production
                'stack.app-studios.net'
            ]
        },

        /**
         * Define per domain config variables
         */
        'dev': {
            'facebook': {
                'app_id': '281169972002167'
            },
            'ga': {
                'id': 'UA-xxxxxx-1' //GA ID for development
            },
            'hello_world': {
                'name': 'Anonymous Developer'
            }
        },
        /**
         * Define per domain config variables
         */
        'production': {
            'facebook': {
                'app_id': '281169972002167'
            },
            'ga': {
                'id': 'UA-xxxxxx-2' //GA ID for production
            },
            'hello_world': {
                'name': 'Anonymous User'
            }
        }
    }


    // init
    Config.bootstrap(config);
})(window.Stack.Config);