function loadNavbar(targetElement) {
    const navHTML = `
        <nav class="bg-custom position-fixed top-0 left-0 w-100" style="z-index: 1100;">
            <div class="container">
                <div class="fs-2 text-bold d-flex justify-content-between align-items-center">
                    <div id="home" style="cursor: pointer;">
                        <span class="text-white-custom">J</span>
                        <i class="fa-solid fa-magnifying-glass fs-3"></i>
                        <span class="text-white-custom">B</span>
                    </div>

                    <span class="text-white-custom">Ứng tuyển việc làm - mọi lúc mọi nơi</span>

                    <div class="fs-4 dropdown">
                        <i class="fa-solid fa-user mx-4" id="userDropdown" data-bs-toggle="dropdown" style="cursor: pointer;"></i>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li id="userInfoMenu" style="display: none;"><a class="dropdown-item"  href="/components/user-info/user-info.html">Thông tin</a></li>
                            <li><a class="dropdown-item text-danger" href="#" id="logout-btn">Đăng xuất</a></li>
                        </ul>

                        <span data-bs-toggle="dropdown" style="cursor: pointer;">
                            <i id="notification" class="fa-solid fa-bell" style="position: relative;"></i>
                            <span id="notificationCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none fs-0-6-custom">
                                0
                            </span>
                        </span>

                        <ul id="notificationList" class="dropdown-menu dropdown-menu-end p-2 overflow-auto" style="max-height: 300px; width: 300px;">
                            <li class="text-center text-muted">Không có thông báo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    `;

    document.getElementById(targetElement).innerHTML = navHTML;

    const role = localStorage.getItem("role");

    // Gán sự kiện sau khi navbar đã được load
    document.getElementById('home').addEventListener('click', () => {
        if (role === "USER") {
            window.location.href = '/components/main.html';
        }
    });

    document.getElementById('notification').addEventListener('click', () => {
        if (count > pageSize) {
            count = count - pageSize;
        } else {
            count = 0;
        }
        updateNotificationBadge();
        currentPageHeader = 0; // Reset page khi mở lại thông báo
        loadNotifications(true);
    });
}

let currentPageHeader = 0;
const pageSize = 4;
let isLoading = false;
let count = 0;

//get notification
async function loadNotifications(reset = false) {
    if (isLoading) return;
    isLoading = true;

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Bạn cần đăng nhập để xem thông báo");
        isLoading = false;
        return;
    }

    try {
        const response = await fetch(`http://localhost:8086/api/v1/notifications?page=${currentPageHeader}&size=${pageSize}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.data.message);
        }

        renderNotifications(result.data.content, reset);
        currentPageHeader++; // Tăng trang sau khi tải xong
    } catch (error) {
        alert(error.message);
    } finally {
        isLoading = false;
    }
}

function setupScrollEvent() {
    console.log("Đã vào thanh cuộn")
    const notificationList = document.getElementById("notificationList");
    if (!notificationList) return;

    notificationList.addEventListener("scroll", function () {
        console.log("Đang cuộn..."); 
        const nearBottom = notificationList.scrollTop + notificationList.clientHeight >= notificationList.scrollHeight - 20;
        if (nearBottom && !isLoading) {
            loadNotifications();
            countNotiHasNotSeen();
        }
    });
}

function renderNotifications(notifications, reset) {
    const container = document.getElementById("notificationList");
    if (!container) return;

    if (reset) {
        container.innerHTML = ""; // Xóa thông báo cũ khi reset
    }

    if (notifications.length === 0 && reset) {
        container.innerHTML = `<li class="text-center text-muted">Không có thông báo</li>`;
        return;
    }

    const role = localStorage.getItem('role'); 

    notifications.forEach(notif => {
        let type = notif.type;

        console.log(type);

        let title = '';
        if (role === 'USER') {
            if (type === 'APPLIED') {
                title = `Bạn đã ứng tuyển vào vị trí <span class = "text-custom">${notif.jobName}</span> của <span class = "text-custom">${notif.fullName}</span>` 
            } else if (type === 'ACCEPTED') {
                title = `Chúc mừng bạn đã ứng tuyển thành công vào vị trí <span class = "text-custom">${notif.jobName}</span> của <span class = "text-custom">${notif.fullName}</span>`
            } else {
                title = `Rất tiếc, bạn chưa phù hợp với vị trí <span class = "text-custom">${notif.jobName}</span> của <span class = "text-custom">${notif.fullName}</span>`
            }
        } else {
            if (type === 'APPLIED') {
                title = `Một ứng viên vừa ứng tuyển vào công việc <span class = "text-custom">${notif.jobName}</span>` 
            } else if (type === 'ACCEPTED') {
                title = `Bạn vừa xét duyệt thành công hồ sơ của ứng viên <span class = "text-custom">${notif.fullName}</span>`
            } else {
                title = `Bạn vừa từ chối hồ sơ của ứng viên <span class = "text-custom">${notif.fullName}</span>`
            }
        }

        const li = document.createElement("li");
        li.className = "dropdown-item";
        li.innerHTML = `
            <p class="m-0 text-wrap">${title}</p>
            <hr>
        `;
        container.appendChild(li);
    });
}

//countNotifi
async function countNotiHasNotSeen() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch('http://localhost:8086/api/v1/notifications/count', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.data.message);
        }


        count = result.data;

        updateNotificationBadge();
    } catch (error) {
        alert(error.message);
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById("notificationCount");
    
    if (!badge) {
        console.error("Không tìm thấy phần tử badge!");
        return;
    }

    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove("d-none"); // Hiện badge
    } else {
        badge.classList.add("d-none"); // Ẩn badge
    }
}

// Gọi loadNavbar khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar('navbar-container'); // Đảm bảo phần tử này tồn tại trong HTML
    countNotiHasNotSeen();
    setupScrollEvent(); // Gọi sự kiện cuộn sau khi navbar đã load

    const role = localStorage.getItem('role');
    if (role === 'USER') {
        document.getElementById("userInfoMenu").style.display = "block";
    }
});