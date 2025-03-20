async function register(formData) {
    try {
        const response = await fetch('http://localhost:8086/api/v1/user/sign-up', {
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(formData)
        });

        const data = await response.json();
        console.log(data)


        if (!response.ok) {
            throw new Error(data.message);
        }
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("role", data.role);

        window.location.href = "/components/login/login.html"
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const role = localStorage.getItem('selectedRole');

    // Gửi dữ liệu sau khi đã loại bỏ required
    const formData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("mail").value,
        phoneNumber: document.getElementById("phone-number").value,
        fullName: role === "RECRUITER" ? document.getElementById("company-name").value : document.getElementById("full-name").value,
        address: role === "RECRUITER" ? document.getElementById("company-address").value : document.getElementById("address").value,
        role: role
    };

    register(formData); // Gửi dữ liệu sau khi đã xử lý
});