
app.factory("customer", function ($location, $q) {

    let activeCustomer = null;

    class Customer {
        constructor(id, techName, displayName, logoUrl) {
            this.id = id;
            this.techName = techName;
            this.displayName = displayName;
            this.logoUrl = logoUrl;
        }
    }

    function getActive() {
        let async = $q.defer();

        if (!activeCustomer) {
            // Getting the subdomain
            let host = $location.host();
            let subdomain = host.indexOf('.') > 0 ? host.split('.')[0] : "";

            // Getting customer related to subdomain
            const ParseCustomer = Parse.Object.extend('Customer');
            const query = new Parse.Query(ParseCustomer);
            query.equalTo("techName", subdomain);
            query.first().then((result) => {
                if (result) {
                    console.log('Customer Parse: ', result);
                    activeCustomer = new Customer(result.id, result.get("techName"),
                        result.get("displayName"), result.get("logo")._url);
                    console.log(activeCustomer);

                    async.resolve(activeCustomer);
                } else {
                    console.error(`Customer ${subdomain} not found`);
                    async.reject(`Customer ${subdomain} not found`);
                }
            }, (error) => {
                console.error('Error while fetching Customer', error);
                async.reject(error);
            });
        } else {
            async.resolve(activeCustomer);
        }

        return async.promise;
    }


    return {
        getActive: getActive
    };
})