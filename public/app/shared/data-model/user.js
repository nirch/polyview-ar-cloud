
app.factory("userSrv", function (customerSrv) {

    async function login(email, pwd) {
         // Pass the username and password to logIn function
         const user = await Parse.User.logIn(email, pwd);
         const customer = await customerSrv.getActive();
         if (user.get("customer") && user.get("customer").id === customer.id) {
            console.log('Logged in user', user);
            return user;   
         } else {
            var queryRole = new Parse.Query(Parse.Role);
            queryRole.equalTo('name', 'admin');
            const adminRole = await queryRole.first();
            var adminRelation = new Parse.Relation(adminRole, 'users');
            var queryAdmins = adminRelation.query();
            queryAdmins.equalTo('objectId', Parse.User.current().id);
            var adminUser = await queryAdmins.first();

            if (adminUser) {
                return user;
            } else {
                await logout();
                throw "User unauthorized";
            }
         }
    }

    async function logout() {
        await Parse.User.logOut();
        console.log('User logged out');
        return;
    }

    return {
        login,
        logout
    }
});
