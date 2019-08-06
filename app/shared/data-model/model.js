
app.factory("modelSrv", function ($q) {


    class Model {
        constructor(parseModel) {
            this.id = parseModel.id;
            this.techName = parseModel.get("techName");
            this.displayName = parseModel.get("displayName");
            this.description = parseModel.get("description");
            this.isLive = parseModel.get("isLive");
            this.isListed = parseModel.get("isListed");
            this.claraId = parseModel.get("claraId");
            this.usdzUrl = parseModel.get("usdz") ? parseModel.get("usdz")._url : null;
            this.gltfUrl = parseModel.get("gltf") ? parseModel.get("gltf")._url : null;
            this.thumbnailUrl = parseModel.get("thumbnail")._url;
            this.projectId = parseModel.get("projectId").id;
            this.order = parseModel.get("order") ? parseModel.get("order") : 0; // default order is 0
            this.editor = parseModel.get("editor");
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


    function updateEditorSettings(model, editorSettings) {
        let async = $q.defer();

        if (editorSettings) {
            model.parseModel.set("editor", editorSettings);
        } else {
            model.parseModel.unset("editor");
        }
        model.parseModel.save().then((response) => {
            console.log('Updated Model', response);
            let model = new Model(response);
            async.resolve(model);
        }, (error) => {
            console.error('Error while updating Model', error);
            async.reject(error);
        });

        return async.promise;
    }

    function updateModel(model, params) {
        let async = $q.defer();

        model.parseModel.set('displayName', model.displayName);
        model.parseModel.set('techName', model.techName);
        model.parseModel.set('isLive', model.isLive);
        model.parseModel.set('isListed', model.isListed);

        if (params.updateProject) {
            model.parseModel.set('projectId', params.updateProject.parseProject); 
        }
        // model.parseModel.set('usdz', new Parse.File("resume.txt", { base64: btoa("My file content") }));
        // model.parseModel.set('projectId', new Parse.Object("Project"));
        // model.parseModel.set('thumbnail', new Parse.File("resume.txt", { base64: btoa("My file content") }));
        // model.parseModel.set('gltf', new Parse.File("resume.txt", { base64: btoa("My file content") }));

        model.parseModel.save().then((response) => {
            console.log('Updated Model', response);
            let model = new Model(response);
            async.resolve(model);
        }, (error) => {
            console.error('Error while updating Model', error);
            async.reject(error);
        });

        return async.promise;
    }

    return {
        getByProject: getByProject,
        getByName: getByName,
        getById: getById,
        updateEditorSettings: updateEditorSettings,
        updateModel: updateModel
    }
});

