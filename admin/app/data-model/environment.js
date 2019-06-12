
app.factory("environmentSrv", function ($q) {


    class Environment {
        constructor(parseEnvironment) {
            this.id = parseEnvironment.id;
            this.displayName = parseEnvironment.get("displayName");
            this.imageUrl = parseEnvironment.get("image")._url;
            this.parseEnvironment = parseEnvironment;
        }
    }

    function getEnvironments() {
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

    return {
        getEnvironments: getEnvironments
    }
});

