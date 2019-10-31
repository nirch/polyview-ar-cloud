
app.factory("userSrv", function () {

    async function login(email, pwd) {
         // Pass the username and password to logIn function
         const user = await Parse.User.logIn(email, pwd);
         console.log('Logged in user', user);
         return user;
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
