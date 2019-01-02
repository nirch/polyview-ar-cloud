
app.factory("projectsSrv", function ($q) {


    class Project {
        constructor(parseProject) {
            this.id = parseProject.id;
            this.techName = parseProject.get("techName");
            this.displayName = parseProject.get("displayName");
            this.thumbnailUrl = parseProject.get("thumbnail")._url;
            this.parseProject = parseProject;
        }
    }

    function getByCustomer(customer) {
        let async = $q.defer();

        const ParseProject = Parse.Object.extend('Project');
        const query = new Parse.Query(ParseProject);
        query.equalTo("customerId", customer.parseCustomer);
        query.find().then(results => {
            console.log('Projects: ', results);
            let projects = [];
            results.forEach(result => {
                projects.push(new Project(result));
            });
            async.resolve(projects);
        }, error => {
            console.error('Error while fetching Projects', error);
            async.reject(error);
        });

        return async.promise;
    }

    return {
        getByCustomer: getByCustomer
    }
});

