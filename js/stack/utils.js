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

var rand = function (min_num, max_num) {
    return Math.floor((Math.random() * (max_num - min_num + 1)) + min_num);
};

String.prototype.pxToInt = function () {
    return new Number(this.replace("px", ""));
};

Object.values = function (obj) {
    var vals = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
};

var get_value_from_array_path = function (data, key) {
    var arr = key.split('.');
    var result = data;

    for (var i = 0; i < arr.length; i++) {
        if (result)
            result = result[arr[i]];
    }
    return result;
};

var array_unique = function (a) {
    var o = {}, i, l = a.length, r = [];
    for (i = 0; i < l; i += 1) o[a[i]] = a[i];
    for (i in o) r.push(o[i]);
    return r;
};


var object_diff = function(a, b) {
    if(!a) {
        a = {};
    }
    if(!b) {
        b = {};
    }

    var all_keys = array_unique(Object.keys(a).concat(Object.keys(b)));

    var equals = false;
    $.each(all_keys, function(k, v) {
        if(a[v] != b[v]) {
            if(equals == false) {
                equals = [];
            }
            equals.push(v);
        }
    });

    return equals;
}


var delayed_execute = (function (fn, delay) {
  var timeout = null;

  return function (/* args */) {
    var args = arguments;
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        fn.apply(null, args); // preserve arguments
        clearTimeout(timeout);
    }, delay);
  };
});

var sort_object = function (obj, cb) {
    var k = Object.keys(obj);


    k.sort(function (a, b) {
        return cb.apply(obj, [a, b])
    });


    var result = {};
    k.forEach(function (v, k) {
        result[v] = obj[v];
    });

    return result;
};

var reverse_sorted_object = function (obj, cb) {
    var k = Object.keys(obj);


    if (cb) {
        k.sort(function (a, b) {
            return cb.apply(obj, [a, b])
        });
    }

    k = k.reverse();


    var result = {};
    k.forEach(function (v) {
        result[v] = obj[v];
    });

    return result;
};


var add_lead_zero_if_needed = function (k) {
    if (k.toString().length == 1) {
        return "0" + k;
    }
    else {
        return k;
    }
};

var get_utc_unixtimestamp = function () {
    return new Date((new Date().toUTCString())).getTime() / 1000
};
var from_utc_unixtimestamp = function (unixtimestamp) {
    return new Date(unixtimestamp * 1000);
};
Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

var serialize_form_to_object = function ($form) {
    var result = {};
    $.each($form.serializeArray(), function (k, v) {
        result[v.name] = v.value;
    });

    return result;
};

var fix_precision = function(v) {
    if(v.toString().indexOf(".") != -1) {
        v = (parseFloat(v.toPrecision(12)));
    }
    return v;
};

var day_of_week_array = function() {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    return weekday;
};

var day_of_week_to_string = function (day_index) {
    return day_of_week_array()[day_index];
};

var sprintf = function (format, etc) {
    var arg = arguments;
    var i = 1;
    return format.replace(/%((%)|s)/g, function (m) {
        return m[2] || arg[i++]
    })
};


/**
 * Math multiply helper
 *
 * @param v
 * @returns {*}
 */
var get_one_if_empty = function(v) {
    if(!v) {
        return 1;
    } else {
        return v;
    }
};