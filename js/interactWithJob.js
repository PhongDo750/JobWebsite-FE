export function toggleLikeJob(jobId) {
    const url = `http://localhost:8086/api/v1/interact/like?jobId=${jobId}`;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để thao tác.")
        window.location.href = "/components/login/login.html";
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
}

export function toggleRemoveLikeJob(jobId) {
    const url = `http://localhost:8086/api/v1/interact/remove-like?jobId=${jobId}`;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để thao tác.")
        window.location.href = "/components/login/login.html";
    }

    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
}
