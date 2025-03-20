document.addEventListener("click", function (event) {
    if (event.target.id === "logout-btn") {
        event.preventDefault();

        localStorage.removeItem("dynamicFilters");
        localStorage.removeItem("currentPage");
        localStorage.removeItem("totalPages");
        localStorage.removeItem("nextPage");
        localStorage.removeItem("tokenOP");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("month");
        localStorage.removeItem("year");

        window.location.href = "/components/login/login.html";
    }
});

