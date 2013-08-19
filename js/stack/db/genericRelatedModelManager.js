/**
 * Generic Model Manager - Supports saving reference to another model.
 *
 * User: lyubomirpetrov
 */

window.Stack = window.Stack || {};
window.Stack.DB = window.Stack.DB || {};

(function(Stack, undefined) {
    var GenericRelatedModelManager = Stack.DB.ModelManager.extend({
        'defaults': {
            'indexes': {
                'obj_client_id': true,
                'obj_model_name': true
            }
        },
        'init': function(options) {
            this._super(options);
            var self = this;


            self.extend_model({
                /**
                 * Get the currently related model's manager.
                 *
                 * @returns {*|Stack.DB.ModelManager}
                 */
                'get_manager': function() {
                    var manager = Stack.DB.ModelManager.factory(this.get("obj_model_name"));
                    return manager;
                },
                /**
                 * Get an instance of the current related model.
                 *
                 * @returns {*|Array}
                 */
                'get_model_instance': function() {
                    var manager = Stack.DB.ModelManager.factory(this.get("obj_model_name"));
                    var obj = manager.get(
                        this.get("obj_client_id"),
                        true
                    );
                    return obj;
                }
            });
        },
        'create_from_model_instance': function(model) {
            var self = this;
            if(!model.get('client_id')) {
                console.error("Cant created generic related model from a non-saved instance: ", model);

                throw new Error("Model instance is not saved.");
            }

            return self.create({
                'obj_model_name': model.option('name'),
                'obj_client_id': model.get('client_id')
            });
        }
    });

    Stack.DB.GenericRelatedModelManager  = GenericRelatedModelManager ; // export
})(window.Stack);