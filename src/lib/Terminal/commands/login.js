export default function login() {
    return {
        name: "l",
        desc: "Login to Spotify",
        action: function () {
            window.location.href = "/api/login";
        }
    }
}
