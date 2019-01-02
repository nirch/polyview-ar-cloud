
app.factory("customer", function ($location) {

    class Customer {
        constructor(displayName, techName, logoUrl) {
            this.displayName = displayName;
            this.techName = techName;
            this.logoUrl = logoUrl;
        }
    }

    // Getting the subdomain
    let host = $location.host();
    let subdomain = host.indexOf('.') > 0 ? host.split('.')[0] : "";

    // Getting customer related to subdomain
    const ParseCustomer = Parse.Object.extend('Customer');
    const query = new Parse.Query(ParseCustomer);
    query.equalTo("techName", subdomain);
    query.first().then((result) => {
        if (result) {
            console.log('Customer found', result);
            console.log('Customer techName:', result.get("techName"));
            console.log('Customer displayName:', result.get("displayName"));
            console.log('Customer logoUrl:', result.get("logo")._url);
        } else {
            console.error(`Customer ${subdomain} not found`);
        }

    }, (error) => {
        console.error('Error while fetching Customer', error);
    });



    return {

    }
})