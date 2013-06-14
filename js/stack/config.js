/**
 * Generic Environment aware Config engine for JS
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};

(function(Stack, $, undefined) {
    var Config = Class.extend({
        'init': function() {
            this._data = false;
            this._env = "dev"; //default environment
        },
        'bootstrap': function(config_data) {
            if(
                typeof(config_data['environments']) == 'undefined' ||
                    typeof(config_data['environments']['order']) == "undefined"
                ) {
                throw new Error("Missing 'environments' def in the config.");
            }
            var last_env = null;
            jQuery.each(config_data['environments']['order'], function(v, k) {
                if(config_data[k] == undefined) {
                    config_data[k] = {};
                }

                if(last_env != null) {
                    config_data[k] = jQuery.extend(
                        true,
                        {},
                        config_data[last_env],
                        config_data[k],
                        true
                    );
                }
                last_env = k;
            });
            this._data = config_data;

            this.detect_environment();
        },
        '_ensure_data_is_loaded': function() {
            if(this._data === false) {
                throw new Error("Config not loaded. Stopping execution.");
            }
        },
        'get': function(key, env, def_value) {
//            this._ensure_data_is_loaded();

            if(def_value == undefined) { // only 2 args? second is def value, and def env is assumed.
                def_value = env;
                env = this._env;
            }



            result = get_value_from_array_path(this._data[env], key);

            if(!result) {
                return def_value;
            } else {
                return result;
            }
        },
        'detect_environment': function() {

            this._ensure_data_is_loaded();

            var config = this;

            jQuery.each(this._data['environments'], function(env_name, hosts) {
                var do_break = false;
                jQuery.each(hosts, function(k, host) {
                    if(window.location.host == host) {
                        config._env = env_name; //set env
                        do_break = true;
                        return false; //break
                    }
                });

                return !do_break; // closure break..jquery's .each magic :(
            });
        }
    });

    Stack.Config = new Config(); // dont init
})(window.Stack, jQuery, undefined);