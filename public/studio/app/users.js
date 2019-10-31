
app.factory("users", function ($location, $q) {

    function activeUser() {
        return Parse.User.current();
    }

    return {
        activeUser
    };
})