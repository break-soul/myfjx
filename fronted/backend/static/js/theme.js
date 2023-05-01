
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        const cookieName = cookie[0];
        const cookieValue = cookie[1];
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

function loadTheme() {
    var root = document.documentElement;
    const themeCookie = getCookie("theme");
    if (themeCookie === "light") {
        root.style.setProperty("--bg-color", "var(--light-bg-color)");
        root.style.setProperty("--bg1-color", "var(--light-bg1-color)");
        root.style.setProperty("--text-color", "var(--light-text-color)");
    } else if (themeCookie === "dark") {
        root.style.setProperty("--bg-color", "var(--dark-bg-color)");
        root.style.setProperty("--bg1-color", "var(--dark-bg1-color)");
        root.style.setProperty("--text-color", "var(--dark-text-color)");
    } else {
        document.cookie = "theme=light;path=/";
        loadTheme()
    }
}

document.getElementById("toggle-theme").addEventListener("click", function (event) {
    const themeCookie = getCookie("theme");
    if (themeCookie == "dark") {
        document.cookie = "theme=light;path=/"
    } else {
        document.cookie = "theme=dark;path=/"
    }
    loadTheme()
});

loadTheme()
