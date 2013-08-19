/**
 * Super Simple ORM inspired by Django
 *
 * Features:
 *  Manager:
 *  - Can sync offline [using tastypieSync plugin]
 *  - Can store (inc) rev nums [using revisionManager]
 *  - Currently uses Stack.DB.Local as a storage engine, but in the future this can be easily swapped w/ something else
 *  (that implements the same get/set/remove/exists interface, yey)
 *  - Support for softDelete (instead of removing the row, will mark it using a property/value called `is_deleted=1`)
 *  - Support for in-memory indexes. Really helpful!
 *  - Events
 *  - Plugins
 *
 *  Model:
 *  - Can track changes (e.g. if trackChanges=true and you call .get_changes() you will get an assoc w/ k/v only w/ the
 *  fields/values which are changed)
 *  - Events
 *  - Plugins
 *  - client_id is the actual primary key, that is locally generated using Math.uuid. Some simple collision detection
 *    IS implemented, but should not be trusted (first rule for web security - don't trust any data from the
 *    client-side).
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
window.Stack.DB = window.Stack.DB || {};

(function(Stack, undefined) {


    var Model = Stack.BaseComponent.extend({
        'name': 'db:model',
        'allow_multiple_instances': true,
        'defaults': {
            /**
             * Name of the model. Required.
             */
            'name': null,

            /**
             * Default data to be used when creating new model instances.
             */
            'defaultData': {},

            /**
             * Enable .get_changes()?
             */
            'trackChanges': true,


            /**
             * Verbose name
             */
            'verbose_name': undefined,

            /**
             * Verbose name - plural
             */
            'verbose_name_plural': undefined,


            /**
             * Don't touch this.
             */
            'is_new': false
        },
        'is_dirty': false,
        'is_new': false,

        /**
         * This should be used by the ModelManager, dont initialize models by your self, except you know what you are
         * doing.
         *
         * @param options
         */
        'init': function(options) {
            this._super(options);
            var self = this;

            self.trigger('before:init', [this]);

            self.manager = self.option('manager');

            if(self.option('is_new')) {
                self.is_dirty = true;
                self.is_new = true;
            }
            self.data = $.extend(true, {}, self.option('defaultData', {}), options['data']);

            if(self.option('trackChanges')) {
                if(!self.is_new) {
                    self.__initial_data = $.extend({}, self.data); // copy
                } else {
                    self.initial_data = {};
                }

            }

            self.trigger('after:init', [this]);
        },

        /**
         * Internal call to set a property and fire the specific events.
         *
         * @param k
         * @param v
         * @returns {boolean}
         */
        '__setProperty': function(k, v) {
            var self = this;
            var e = self.trigger('before:set', [this, {
                'key': k,
                'value': v
            }]);

            if(e.isPropagationStopped()) {
                return false;
            }

            self.data[k] = v;

            self.is_dirty = true;


            self.trigger("after:set");
        },

        /**
         * Set property/properties
         * You can use this as model.set({'x': 1}) <- jQuery.css({}) style.
         *
         * @param k
         * @param v
         */
        'set': function(k, v) {
            var self = this;

            if($.isPlainObject(k) && !v) {
                k = $.extend(true, {}, k); /* dont keep refs */
                $.each(k, function(kk, vv) {
                    self.__setProperty(kk, vv);
                });
            } else {
                if($.isPlainObject(v)) {
                    v = $.extend(true, {}, v); /* dont keep refs */
                }
                self.__setProperty(k, v);
            }

            self.trigger("after:change", [this]);
        },


        /**
         * Return a diff (or false) between the stored and current data in this instance.
         *
         * @returns {boolean|*}
         */
        'get_changes': function() {
            var self = this;
            if(!self.option('trackChanges')) {
                throw new Error("Track changes is not enabled for this model - " + self.name + ".");
            }

            var diff_keys = object_diff(self.data, self.__initial_data);
            var result = {};

            $.each(diff_keys, function(k, v) {
                result[v] = self.data[v];
            });

            return $.isEmptyObject(result) ? false : result;
        },

        /**
         * Get property
         *
         * @param k
         * @returns {*}
         */
        'get': function(k) {
            var self = this;
            return self.data[k];
        },

        /**
         * Internal function that generates IDs
         *
         * @returns {*}
         */
        'generate_id': function() {
            return Math.uuid(30);
        },

        /**
         * Save this row
         *
         * @returns {boolean}
         */
        'save': function() {
            var self = this;

            var e = self.trigger('before:save', [this]);
            if(e.isPropagationStopped()) {
                return false;
            }

            if(!self.get_changes()) {
                // no changes.
//                console.error("No changes in model data", this);
                return false;
            } else {
//                console.error("Changes found in: ", this, self.get_changes());
            }

            if(self.is_new) {
                self.data.client_id = self.generate_id();
                // Collision?
                while(self.manager.exists(self.data.client_id)) {
                    self.data.client_id = self.generate_id();
                }

                self.manager.storage.insert(self.data.client_id, self.data);

//                console.log("model inserted", this);
            } else {
                self.manager.storage.update(self.data.client_id, self.data);
//                console.log("updated model", this);
            }

            self.is_dirty = false;
            self.is_new = false;

            if(self.option('trackChanges')) {
                self.__initial_data = $.extend(true, {}, self.data);
            }

            self.trigger('after:save', [this]);

            self.trigger('after:change', [this]);

            return true;
        },

        /**
         * Delete this row.
         * See: option('softDelete')
         *
         * @returns {boolean}
         */
        'delete': function() {
            var self = this;

            var e = self.trigger('before:delete', [this]);
            if(e.isPropagationStopped()) {
                return false;
            }

            if(self.manager.option('softDelete', false)) {
                self.set("is_deleted", 1);
                self.save();
            } else {
                var k = self.get('client_id');
                if(self.manager.storage.exists(k)) { // not in storage (new?)
                    self.manager.storage.remove(k);
                }
            }

            self.is_new = false;

            self.trigger('after:delete', [this]);

            self.trigger('after:change', [this]);

            return true;
        },
        'get_verbose_name': function() {
            var self = this;

            return self.option('verbose_name') ? self.option('verbose_name') :  self.option('name');
        },
        'get_verbose_name_plural': function() {
            var self = this;

            return self.option('verbose_name_plural') ? self.option('verbose_name_plural') :  self.option('name') + 's';
        }
    });




    Stack.DB.Model = Model; // export



    var _model_managers = {};

    var ModelManager = Stack.BaseComponent.extend({
        'name': 'db:manager',
        'allow_multiple_instances': true,
        'defaults': {
            /**
             * Storage (Stack.DB.Loca) Configuration
             */
            'storageConfig': {
            },
            /**
             * Model Config (required! - {'modelConfig': {'name': 'myModelName'}})
             */
            'modelConfig': {
            },

            /**
             * Enable soft delete.
             */
            'softDelete': true,


            /**
             * List indexes that need to be cached in memory, e.g.:
             * {
             *  'property': true,
             *  'user_id': true
             * }
             */
            'indexes': {}
        },
        /**
         * Initialize the ModelManager.
         * In Django terms, this is the actual "schema" (besides the fact that it does NOT incl. any schema info, just
         * an object that you can use for finding/getting model instances).
         *
         * @param options
         */
        'init': function(options) {
            this._super(options);
            var self = this;


            self.storage = new Stack.DB.Local(
                $.extend(
                    true,
                    {},
                    self.option('storageConfig', {}),
                    {
                        'name': self.option('modelConfig.name')
                    }
                )
            );

            self.model_cls = Stack.DB.Model;

            self.reload();

            self.rebuild_indexes();

            self.storage.bind('after:persist', function() {
                //TODO: This CAN be optimized, just saying :)
                self.rebuild_indexes();
            });


            /**
             * register this manager in to the global managers registry (this helps the ModelManager.factory(name) to
             * access the models globally.
             */
            _model_managers[self.option('modelConfig.name')] = this;

            self.trigger('init', [this]);
        },
        /**
         * Simple way to extend this manager's model w/ additional (business) logic.
         *
         * @param data
         */
        'extend_model': function(data) {
            var self = this;
            self.model_cls = self.model_cls.extend(data);
        },
        /**
         * This method is used to update the index map cache of a specific object.
         *
         * TODO: Use it on change, delete, etc. (right now is used only on rebuild_indexes)
         *
         * @param kk
         * @param item
         */
        '__inc_build_index_for_item': function(kk, item) {
            var self = this;
            $.each(self.option('indexes'), function(k, v) {
                if(v == true && item[k]) {
                    if(!self.__index_map[k]) {
                        self.__index_map[k] = {};
                    }

                    if(!self.__index_map[k][item[k]]) {
                        self.__index_map[k][item[k]] = [];
                    }
                    self.__index_map[k][item[k]].push(kk);
                }
            });
        },
        /**
         * Rebuilds the in-memory indexes (tip: into a hashmap)
         */
        'rebuild_indexes': function() {
            var self = this;
            self.__index_map = {};

            self.trigger('before:rebuild_indexes', [this]);

            $.each(self.storage.data, function(kk, item) {
                self.__inc_build_index_for_item(kk, item);
            });

            self.trigger('after:rebuild_indexes', [this]);
        },
        /**
         * Create a Model instance for this manager, w/ the target data and options.
         * Mostly used internally, so don't use if you don't know what is doing.
         *
         * @param data
         * @param options
         * @returns {Stack.DB.Model}
         */
        'get_model': function(data, options) {
            var self = this;

            var options = $.extend(
                true,
                {},
                self.option('modelConfig'),
                options,
                {
                    'data': data,
                    'manager': self
                }
            );

            var model = new self.model_cls(options);


            model.bind('after:change', function(m) {
                self.reload();
            });

            /**
             * We want to proxy all events called on the model back to the manager (because its REALLY helpful!).
             */
            self.proxyEvent("model", "before:save", model);
            self.proxyEvent("model", "after:save", model);
            self.proxyEvent("model", "before:delete", model);
            self.proxyEvent("model", "after:delete", model);
            self.proxyEvent("model", "change", model);


            self.trigger('model:init', [this, model]);


            return model;
        },
        /**
         * Create a new (non-saved) object.
         * After creating a new object, always call .save() to persist it.
         *
         * @param data
         * @param options
         * @returns {Stack.DB.Model}
         */
        'create': function(data, options) {
            var self = this;

            options = $.extend(
                true,
                {},
                options,
                {'is_new': true}
            );

            return self.get_model(
                $.extend(true, {}, data), /* ! no copy refs */
                options
            );
        },
        /**
         * Reload data from storage
         *
         * @returns {{}}
         */
        'reload': function() {
            var self = this;

            self.data = $.extend(true, {}, self.storage.all());

            if(self.data) {
                if(self.option('softDelete')) {
                    $.each(self.data, function(k, v) {
                        if(v.is_deleted) {
                            delete self.data[k]; /* hide! */
                        }
                    });
                }
            } else {
                return self.data = {};
            }
        },
        /**
         * Get all data.
         *
         * @returns {*}
         */
        'all': function() {
            var self = this;
            return self.data ? self.data : {};
        },
        /**
         * Filter elements by index (and optional value).
         * Works like a WHERE clause in SQL (or a Person.objects.all().filter(index=value),
         * with the only difference that this optimizes and uses all key/values in memory (client side).
         *
         * @param k
         * @param v
         * @returns {Array}
         * @param is_deleted
         */
        "filter_by_index": function(k, v, is_deleted) {
            var self = this;
            if(!self.option('indexes')[k]) {
                throw new Error("Index not found: " + k);
            }
            var results = new Array();

            if(self.__index_map[k]) {
                $.each(self.__index_map[k], function(val, k_val_map) {
                    $.each(k_val_map, function(idx, row_idx) {
                        if(!v || v == val) {
                            var found = self.get(row_idx, is_deleted);

                            if(found) { // found may be == undefined in case this row was deleted.
                                results.push(found);
                            }
                        }
                    });
                });
            }
            return results;
        },

        /**
         * Filter FIRST element by index (and optional value).
         * @param k
         * @param v
         * @returns {Array}
         * @param is_deleted
         */
        "get_by_index": function(k, v, is_deleted) {
            var self = this;

            var res = self.filter_by_index(k, v, is_deleted);

            if(res && res[0]) {
                return res[0];
            }
        },

        /**
         * Get element by ID
         *
         * @param is_deleted
         * @param k
         * @returns {*}
         */
        'get': function(k, is_deleted) {
            var self = this;

            var data = self.all()[k];
            if(!data) {
                if(is_deleted) { //if is_delated=true, then try to find it in the recycle bin (localStorage) :)
                    data = self.storage.all()[k]; // get it from the actual storage, not from the currently loaded items.
                    if(!data) {
                        return undefined;
                    }
                } else {
                    return undefined;
                }
            }


            var options = $.extend(
                true,
                {},
                {'is_new': false}
            );

            return self.get_model(data, options);
        },
        /**
         * Use this as your last option for finding elements (it uses a lot of resources).
         * Recommended - use filter_by_index.
         *
         * @param cb
         * @returns {Array}
         */
        'filter': function(cb) {
            var self = this;
            var results = {};

            $.each(self.all(), function(k, v) {
                if(cb(k, v) == true) {
                    results[k] = self.get(k);
                }
            });

            return results;
        },


        /**
         * Simple helper function for sorting objects.
         *
         * @param key - field name/key OR a callback that accepts 2 arguments (a and b for comparison)
         * @param order string - ASC/DESC
         */
        'order_by': function(key, order) {
            var self = this;
            if(!order) {
                order = "ASC";
            }

            return sort_object(self.data, function(a, b) {
                if($.isFunction(key)) { // callable
                    var x = key(self.data[a][key], self.data[b][key]);
                    if(order.toLowerCase() == "desc") {
                        x = x * -1;
                    }
                    return x;
                } else { // string - key name
                    if(order.toLowerCase() == "desc") {
                        return self.data[b][key] - self.data[a][key];
                    } else {
                        return self.data[a][key] - self.data[b][key];
                    }
                }
            });
        },

        /**
         * $.each alias, but with callback arguments like:
         *  cb(
         *      client_id,
         *      modelInstance
         *  )
         *
         *
         * @param cb
         * @returns {*}
         */
        'each': function(cb) {
            var self = this;

            return $.each(self.all(), function(k, v) {
                return cb(k, self.get(v['client_id']));
            });
        },

        /**
         * Clear ALL models/rows.
         */
        'clear': function() {
            var self = this;
            self.trigger('before:clear', [this]);

            /**
             * We should call .delete() (to trigger events for plugins)
             */
            self.each(function(k, v) {
                v.delete();
            });

            if(!self.option('softDelete')) {
                self.storage.clear();
            } else {
                self.storage.persist();
            }
            self.reload();

            self.trigger('after:clear', [this]);
        },
        /**
         * Returns the TOTAL number of items.
         *
         * @returns {Number}
         */
        'count': function() {
            var self = this;
            return self.keys().length;
        },

        /**
         * Returns ALL ids.
         *
         * @returns {Array}
         */
        'keys': function() {
            var self = this;
            return Object.keys(self.all());
        },

        /**
         * Check if `k` exists.
         * If is_deleted = true, then it will check if it is deleted (use this only if softDelete=true).
         *
         * @param k
         * @param is_deleted
         * @returns {boolean}
         */
        'exists': function(k, is_deleted) {
            var self = this;

            var data = self.all()[k];
            if(!data) {
                if(is_deleted) {
                    data = self.storage.all()[k]; // get it from the actual storage, not from the currently loaded items.
                    if(!data) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return true;
        }
    });

    /**
     * Factory method for accessing ALL registered (initialized) ModelManagers based on their model name.
     * Tip: similar to the get_model() func in Django.
     *
     * @param name
     * @returns {Stack.DB.ModelManager}
     */
    ModelManager.factory = function(name) {
        return _model_managers[name];
    };

    Stack.DB.ModelManager = ModelManager; // export
})(window.Stack);