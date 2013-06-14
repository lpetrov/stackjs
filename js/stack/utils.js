/**
 * Stack Util Funcs.
 * User: lyubomirpetrov
 */

/** patch console.* first (IE...) **/

(function() {
    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function() {};
        }
    }
})();

function rand(min_num, max_num){
    return Math.floor((Math.random() * (max_num-min_num+1))+min_num);
}

String.prototype.pxToInt = function() {
    return new Number(this.replace("px", ""));
}

function get_value_from_array_path(data, key) {
    var arr = key.split('.');
    var result = data;

    for(var i = 0; i < arr.length; i++){
        if(result)
            result = result[arr[i]];
    }
    return result;
}