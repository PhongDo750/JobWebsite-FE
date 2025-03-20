//login using username + password

async function loginRequest(username, password) {
   try {
    const response = await fetch('http://localhost:8086/api/v1/user/log-in', {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({username, password})
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    console.log(data)

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("role", data.role);

    if (data.role === 'USER') {
        window.location.href = "/components/main.html";
    } else if(data.role === 'RECRUITER'){
        window.location.href = "/components/recruiter-info/recruiter-info.html";
    } else {
        window.location.href = "/components/admin/admin.html";
    }
   } catch(error) {
        alert(error.message);
   }
}

document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    loginRequest(username, password);
});

/*login using google*/

//request url to get code
async function requestUrl() {
    try {
        const response = await fetch('http://localhost:8086/api/v1/auth/google-url', {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Lấy URL Google thất bại!");
        }

        const authUrl = await response.text(); // Lấy URL từ response
        window.location.href = authUrl; // Chuyển hướng người dùng đến Google Auth
    } catch (error) {
        alert(error.message);
    }
}

//handle login with role
async function loginGoogle(code) {
    try {
        const response = await fetch(`http://localhost:8086/api/v1/auth/logIn?code=${encodeURIComponent(code)}`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Đăng nhập thất bại!");
        }

        const result = await response.json(); // Phải có `await` ở đây!
        localStorage.setItem("tokenOP", result.accessTokenOP);
        localStorage.setItem("token", result.accessTokenRP);
        let role = result.role;

        if (role === "USER") {
            window.location.href = "/components/main.html"; // Chuyển hướng sau khi login thành công
        } else if (role === "RECRUITER") {
            window.location.href = "/components/recruiter-info/recruiter-info.html"; // Chuyển hướng sau khi login thành công
        } else {
            console.log('vao r do')
            let modal = new bootstrap.Modal(document.getElementById("registerModal"));
            modal.show();
                
            console.log("da hien thi");
            // Lắng nghe sự kiện click trên thẻ chọn role
            document.querySelectorAll(".role-select").forEach(card => {
                card.addEventListener("click", function () {
                    let selectedRole = this.getAttribute("data-role");
            
                    fetch(`http://localhost:8086/api/v1/user/set-role?role=${selectedRole}`, {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token"), // Lấy token từ localStorage
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => {
                        console.log(response.data);
                        if (response.ok) {
                            localStorage.setItem("role", selectedRole); // Lưu role vào localStorage
            
                            let modal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
                            modal.hide(); // Ẩn modal
            
                            // Chuyển hướng người dùng
                            if (selectedRole === "USER") {
                                window.location.href = "/components/main.html";
                            } else if (selectedRole === "RECRUITER") {
                                window.location.href = "/components/recruiter-info/recruiter-info.html";
                            }
                        } else {
                            alert("Có lỗi xảy ra! Vui lòng thử lại.");
                        }
                    })
                    .catch(error => console.error("Error:", error));
                });
            }); 
        }
    } catch (error) {
        alert(error.message);
        window.location.href = "/components/login/login.html";
    }
}

// Lắng nghe sự kiện click vào nút đăng nhập Google
document.getElementById("login-google").addEventListener("click", function (event) {
    event.preventDefault();
    requestUrl();
});

// Kiểm tra URL để lấy `code` sau khi redirect từ Google
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
        loginGoogle(code); // Nếu có code, tự động đăng nhập
    }
});

