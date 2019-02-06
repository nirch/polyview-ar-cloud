
app.factory("customerSrv", function ($location, $q) {

    let activeCustomer = null;

    class Customer {
        constructor(parseCustomer) {
            this.id = parseCustomer.id;
            this.techName = parseCustomer.get("techName");
            this.displayName = parseCustomer.get("displayName");
            this.logoUrl = parseCustomer.get("logo")._url;
            this.websiteUrl = parseCustomer.get("websiteUrl");
            this.parseCustomer = parseCustomer;
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
                    activeCustomer = new Customer(result);
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

    function getById(customerId) {
        let async = $q.defer();

        const ParseCustomer = Parse.Object.extend('Customer');
        const query = new Parse.Query(ParseCustomer);
        query.get(customerId).then(result => {
            if (result) {
                let customer = new Customer(result);
                async.resolve(customer);
            } else {
                async.reject(404);
            }
        }, error => {
            console.error('Error while fetching customer', error);
            async.reject(error);
        });

        return async.promise;
    }


    return {
        getActive: getActive,
        getById: getById
    };
})