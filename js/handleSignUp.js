document.addEventListener("DOMContentLoaded", function () {

    const currentPath = window.location.href;
    const baseURL = window.location.origin;

    if(currentPath === `${baseURL}/components/login/login.html`) {
        // Lắng nghe sự kiện click vào lựa chọn role
        document.querySelectorAll(".role-select").forEach(item => {
            item.addEventListener("click", function () {
                const role = this.getAttribute("data-role"); // Lấy role (user/employer)
                localStorage.setItem("selectedRole", role); // Lưu vào localStorage
                console.log("Bạn đã chọn role:", role);
                // Điều hướng sang trang đăng ký
                window.location.href = "/components/signup/sign-up.html";
            });
        });
    }

    if (currentPath === `${baseURL}/components/signup/sign-up.html`) {
        const selectedRole = localStorage.getItem("selectedRole");
        if (selectedRole) {
            console.log("Đã vào trang đăng ký");
            document.getElementById("form-title").innerText =
                selectedRole === "USER" ? "Thông tin người tìm việc" : "Thông tin nhà tuyển dụng";

            if (selectedRole === "USER") {
                document.getElementById("user-info").classList.remove("d-none-custom");
            } else {
                document.getElementById("company-info").classList.remove("d-none");
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitGetCode").addEventListener('click', function() {

        const username = document.getElementById("recoverPasswordId").value.trim();

        if (!username) {
            alert('Vui lòng nhập username');
            return;
        }

        // Ẩn modal hiện tại
        let recoverModal = bootstrap.Modal.getInstance(document.getElementById("recoverPassword"));
        recoverModal.hide();

        // Hiển thị modal tiếp theo
        let submitModal = new bootstrap.Modal(document.getElementById("submitForm"));
        submitModal.show();

        getCode(username);

    })
});

async function getCode(username) {
    try {
        const response = await fetch(`http://localhost:8086/api/v1/user/send-code-email?username=${username}`, {
            method: "POST"
        });

        console.log(response)
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message)
        }

        localStorage.setItem("username", username);
    } catch(error) {
        alert(error.message);
    }
} 

document.getElementById("acceptSubmission").addEventListener("click", function () {
    const code = document.getElementById("codeEmail").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const username = localStorage.getItem("username"); 

    if (!code || !newPassword) {
        alert("Vui lòng nhập đầy đủ mã xác nhận và mật khẩu mới!");
        return;
    }

    const formData = {
        code: code,
        newPassword: newPassword,
        username: username
    }

    recoverPassword(formData);
});

async function recoverPassword(formData) {
    try {
        const response = await fetch('http://localhost:8086/api/v1/user/recover-password', {
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        localStorage.removeItem("username");

        alert("Mật khẩu đã được đặt lại thành công!");

        // Ẩn modal sau khi hoàn thành
        let submitModal = bootstrap.Modal.getInstance(document.getElementById("submitForm"));
        submitModal.hide();
    } catch(error) {
        alert(error.message);
    }
}
