
app.factory("modelSrv", function ($q) {


    class Model {
        constructor(parseModel) {
            this.id = parseModel.id;
            this.techName = parseModel.get("techName");
            this.displayName = parseModel.get("displayName");
            this.description = parseModel.get("description");
            this.isLive = parseModel.get("isLive");
            this.claraId = parseModel.get("claraId");
            this.usdzUrl = parseModel.get("usdz")._url;
            this.thumbnailUrl = parseModel.get("thumbnail")._url;
            this.projectId = parseModel.get("projectId").id;
            this.order = parseModel.get("order") ? parseModel.get("order") : 0; // default order is 0
            this.parseModel = parseModel;
        }
    }

    function getByProject(project, onlyListed = true) {
        let async = $q.defer();

        const ParseModel = Parse.Object.extend('Model');
        const query = new Parse.Query(ParseModel);
        query.equalTo("projectId", project.parseProject);
        if (onlyListed) {
            query.equalTo("isListed", onlyListed);
        }
        query.find().then(results => {
            console.log('Models: ', results);
            let models = [];
            results.forEach(result => {
                models.push(new Model(result));
            });
            async.resolve(models);
        }, error => {
            console.error('Error while fetching Models', error);
            async.reject(error);
        });

        return async.promise;
    }

    function getByName(project, name, onlyLive = true) {
        let async = $q.defer();

        const ParseModel = Parse.Object.extend('Model');
        const query = new Parse.Query(ParseModel);
        query.equalTo("techName", name);
        query.equalTo("projectId", project.parseProject);
        if (onlyLive) {
            query.equalTo("isLive", onlyLive);
        }
        query.first().then(result => {
            if (result) {
                let model = new Model(result);
                async.resolve(model);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching model', error);
            async.reject(error);
        });

        return async.promise;
    }

    function getById(modelId) {
        let async = $q.defer();

        const ParseModel = Parse.Object.extend('Model');
        const query = new Parse.Query(ParseModel);
        query.get(modelId).then(result => {
            if (result) {
                let model = new Model(result);
                async.resolve(model);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching model', error);
            async.reject(error);
        });

        return async.promise;
    }


    return {
        getByProject: getByProject,
        getByName: getByName,
        getById: getById
    }
});

