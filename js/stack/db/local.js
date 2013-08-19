/**
 * Stack.DB.Local - Simple Local Key/Value Storage abstraction layer built on top of LocalStorage.
 *
 * Features:
 *  - Clever/somehow optimized Local Storage Persistence
 *  - Events
 *  - Plugins
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
window.Stack.DB = window.Stack.DB || {};

(function(Stack, undefined) {

    /**
     * Warning: "Uncaught [object Object]" is a bug in chrome.
     * https://code.google.com/p/chromium/issues/detail?id=228909
     */

    // NotFound Exception
    var NotFound = function(m, k) {
        this.name = "NotFound";
        this.message = m;
        this.key = k;

        // Helper to indicate the actual exception msg
        // https://code.google.com/p/chromium/issues/detail?id=228909
        if(window.navigator.userAgent.indexOf("Chrome") > -1) {
            console.error("Exception debug for chrome: ", this.toString());
        }
    }
    NotFound.prototype = new Error;

    // AlreadyExists Exception
    var AlreadyExists = function(m, k) {
        this.name = "AlreadyExists";
        this.message = m;
        this.key = k;

        // Helper to indicate the actual exception msg
        if(window.navigator.userAgent.indexOf("Chrome") > -1) {
            console.error("Exception debug for chrome: ", this.toString());
        }
    }
    AlreadyExists.prototype = new Error;

    /**
     * Local - LocalStorage implementation
     * @type {*}
     */
    var Local = Stack.BaseComponent.extend({
        'name': 'db:local',
        'allow_multiple_instances': true,
        'NotFound': NotFound,
        'AlreadyExists': AlreadyExists,
        'defaults': {
            /**
             * Change this if you need multiple instances of this class.
             */
            'name': 'default',

            /**
             * Or this. Or both.
             */
            'localStoragePrefix': 'sdb-'
        },
        'init': function(options) {
            this._super(options);
            var self = this;

            self.reload();
        },

        /**
         * Load/reload data from the backend (localStorage)
         */
        'reload': function() {
            var self = this;
            self.data = localStorage.getItem(self.getBucketName());
            if(!self.data) {
                self.data = {}
            } else {
                self.data = JSON.parse(self.data);
            }

            self.trigger('after:reload');
        },

        /**
         * Get the actual bucket name where to store the data in the backend.
         *
         * @returns {*}
         */
        'getBucketName': function() {
            var self = this;
            return self.option('localStoragePrefix')  + self.option('name');
        },

        /**
         * Destructive method. Will clear/reset the data in this instance to {}.
         */
        'clear': function() {
            var self = this;

            localStorage.setItem(
                self.getBucketName(),
                JSON.stringify({})
            );
            self.reload();

            self.trigger('after:clear');
            self.trigger('after:change');
        },

        /**
         * Persist any data from this instance to the backend (called everytime something is changed).
         */
        'persist': function() {
            var self = this;

            localStorage.setItem(
                self.getBucketName(),
                JSON.stringify(self.data)
            );

            self.trigger('after:persist');
        },

        /**
         * Insert new row (k=key, v=value), k should be unique, as key/value map.
         * Row w/ this k should NOT exists or an AlreadyFound exception will be thrown.
         *
         * @param k
         * @param v
         * @param dont_persist
         * @returns {boolean}
         */
        'insert': function(k, v, dont_persist) {
            var self = this;

            if(self.exists(k)) {
                throw new self.AlreadyExists("A row w/ the same key already exists", k);
            }


            var e = self.trigger('before:insert', [this, {
                'key': k,
                'value': v
            }]);

            if(e.isPropagationStopped()) {
                return false;
            }

            self.data[k] = v;

            if(!dont_persist) {
                self.persist();
            }

            self.trigger('after:insert', [this, {
                'key': k,
                'value': v
            }]);

            self.trigger('after:change');
        },
        /**
         * Update a row `k` w/ value `v`.
         * Row SHOULD already exists or a NotFound exception will be thrown.
         *
         * @param k
         * @param v
         * @returns {boolean}
         * @param dont_persist
         */
        'update': function(k, v, dont_persist) {
            var self = this;

            if(!self.exists(k)) {
                throw new self.NotFound("Not Found.", k);
            }

            var changes = object_diff(self.get(k), v);
            if(changes == false) {
                /**
                 * Dont call persist or any event. Nothing had changed.
                 */
                return;
            } else {
                // pass
            }

            var e = self.trigger('before:update', [this, {
                'key': k,
                'value': v
            }]);
            if(e.isPropagationStopped()) {
                return false;
            }

            /**
             * Deep copies the object in `v`
             */
            if($.isPlainObject(v)) {
                v = $.extend(true, {}, v);
            }

            self.data[k] = v;

            if(!dont_persist) {
                self.persist();
            }

            self.trigger('after:update', [this, {
                'key': k,
                'value': v
            }]);


            self.trigger('after:change');
        },
        /**
         * Check if k exists.
         *
         * @param k
         * @returns {boolean}
         */
        'exists': function(k) {
            var self = this;
            return typeof(self.data[k]) != "undefined" && self.data[k] != null ? true : false

        },
        /**
         * Get data for k
         *
         * @param k
         * @returns {*}
         */
        'get': function(k) {
            var self = this;
            if(!self.exists(k)) {
                throw new self.NotFound("Not Found.", k);
            }
            var v = self.data[k];

            self.trigger('after:get', [this, {
                'key': k,
                'value': v
            }]);

            return v;
        },
        /**
         * Loop over ALL data. This should NOT change the data.
         *
         * @param cb
         * @returns {*}
         */
        'each': function(cb) {
            var self = this;
            return $.each(self.data, cb);
        },
        /**
         * Return all data as a key/value (assoc array). Should be used only for readonly access.
         *
         * @returns {*}
         */
        'all': function() {
            var self = this;
            var result = {};
            self.each(function(k, v) {
                result[k] = v;
            });

            return result;
        },
        /**
         * Remove an item.
         * If k does not exists, this method will throw a NotFound exception.
         *
         * @param k
         */
        'remove': function(k) {
            var self = this;
            if(!self.exists(k)) {
                throw new self.NotFound("Not Found.", k);
            }

            self.trigger('after:remove', [this, {
                'key': k,
                'value': self.data[k]
            }]);

            delete self.data[k];

            self.persist();
            self.trigger('after:change');
        },
        /**
         * Returns ALL keys in this Local instance.
         *
         * @returns {Array}
         */
        'keys': function() {
            var self = this;
            return Object.keys(self.data);
        },

        /**
         * Return the total numbers of items
         * @returns {Number}
         */
        'count': function() {
            var self = this;
            return self.keys().length;
        }
    });




    Stack.DB.Local = Local; // export
})(window.Stack);