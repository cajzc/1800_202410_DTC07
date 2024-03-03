// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup', // Use popup for sign-in flow
    signInSuccessUrl: '../pages/main.html', // Redirect URL after successful sign-in
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID, // Allow sign-in with email/password
    ],
    tosUrl: '<your-tos-url>', // Terms of service URL
    privacyPolicyUrl: '<your-privacy-policy-url>' // Privacy policy URL
};


ui.start('#firebaseui-auth-container', uiConfig);