
app.factory("environmentSrv", function ($q) {


    class Environment {
        constructor(parseEnvironment) {
            this.id = parseEnvironment.id;
            this.displayName = parseEnvironment.get("displayName");
            this.imageUrl = parseEnvironment.get("image")._url;
            this.parseEnvironment = parseEnvironment;
        }
    }

    function getAll() {
        let async = $q.defer();

        const ParseEnvironment = Parse.Object.extend('Environment');
        const query = new Parse.Query(ParseEnvironment);
        query.find().then(results => {
            console.log('Environments: ', results);
            let environments = [];
            results.forEach(result => {
                environments.push(new Environment(result));
            });
            async.resolve(environments);
        }, error => {
            console.error('Error while fetching Environments', error);
            async.reject(error);
        });

        return async.promise;
    }

    function getById(envId) {
        let async = $q.defer();

        const ParseEnvironment = Parse.Object.extend('Environment');
        const query = new Parse.Query(ParseEnvironment);
        query.get(envId).then(result => {
            if (result) {
                let env = new Environment(result);
                async.resolve(env);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching env', error);
            async.reject(error);
        });

        return async.promise;

    }
    
    return {
        getAll: getAll,
        getById: getById
    }
});

