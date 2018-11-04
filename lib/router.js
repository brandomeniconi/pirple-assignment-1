
var router = {
    // Stores all the route objects
    routes: {},

    // This will be used when no other route matches
    defaultRoute: { 
        'name': 'default',
        'handle' : function(){ 
            callback(404);
         }
    },

    // Get all the routes for a specific HTTP method
    getRoutes : function( method ) {
        if ( typeof this.routes[method] === 'undefined' ) {
            return {};
        }

        return this.routes[method];
    },    

    // Get the route for a specific path
    getRoute : function( method, path ) {
        let methodRoutes = this.getRoutes(method);

        if ( typeof methodRoutes[path] === 'undefined'  ) {
            return this.defaultRoute;
        }

        return methodRoutes[path];
    },

    // Add a route handler to this router
    addRoute: function( method, path, handler ) {
        let methodRoutes = this.getRoutes(method);

        methodRoutes[path] = { 
            'name': path,
            'handle' : handler
        };

        this.routes[method] = methodRoutes;
    },

    // Sets a custom default route
    setDefaultRoute: function( name, handler ) {
        this.defaultRoute = { 
            'name': name,
            'handle' : handler
        };
    }
};

module.exports = router;