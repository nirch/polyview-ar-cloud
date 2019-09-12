
app.factory("projectSrv", function ($q) {


    class Project {
        constructor(parseProject) {
            this.id = parseProject.id;
            this.techName = parseProject.get("techName");
            this.displayName = parseProject.get("displayName");
            this.thumbnailUrl = parseProject.get("thumbnail")._url;
            this.customerId = parseProject.get("customerId").id;
            this.isListed = parseProject.get("isListed");
            this.parseProject = parseProject;
        }
    }

    function getByCustomer(customer, onlyListed = true) {
        let async = $q.defer();

        const ParseProject = Parse.Object.extend('Project');
        const query = new Parse.Query(ParseProject);
        query.equalTo("customerId", customer.parseCustomer);
        if (onlyListed) {
            query.equalTo("isListed", onlyListed);
        }
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

    function getByName(customer, name) {
        let async = $q.defer();

        const ParseProject = Parse.Object.extend('Project');
        const query = new Parse.Query(ParseProject);
        query.equalTo("techName", name);
        query.equalTo("customerId", customer.parseCustomer);
        query.first().then(result => {
            if (result) {
                let project = new Project(result);
                async.resolve(project);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching project', error);
            async.reject(error);
        });

        return async.promise;
    }

    function getById(projectId) {
        let async = $q.defer();

        const ParseProject = Parse.Object.extend('Project');
        const query = new Parse.Query(ParseProject);
        query.get(projectId).then(result => {
            if (result) {
                let project = new Project(result);
                async.resolve(project);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching project', error);
            async.reject(error);
        });

        return async.promise;
    }

    function update(project, params) {
        let async = $q.defer();

        project.parseProject.set('displayName', project.displayName);
        project.parseProject.set('techName', project.techName);
        project.parseProject.set('isListed', project.isListed);

        if (params.newThumbnail) {
            project.parseProject.set('thumbnail', new Parse.File(params.newThumbnail.name, { base64: params.newThumbnail.data }, params.newThumbnail.contentType));
        }

        project.parseProject.save().then((response) => {
            console.log('Updated Project', response);
            let project = new Project(response);
            async.resolve(project);
        }, (error) => {
            console.error('Error while updating Project', error);
            async.reject(error);
        });

        return async.promise;
    }


    return {
        getByCustomer: getByCustomer,
        getByName: getByName,
        getById: getById,
        update: update
    }
});

