import { toggleLikeJob } from "./interactWithJob.js";
import { toggleRemoveLikeJob } from "./interactWithJob.js";


//Lấy thông tin người dùng
document.querySelector('a[href="#info"]').addEventListener('shown.bs.tab', () => {
    getInfomationUser();
});

async function getInfomationUser() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập trước khi xem thông tin!");
            return;
        }

        const response = await fetch(`http://localhost:8086/api/v1/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }

        const infoUser = result.data;
        const userInfoContainer = document.getElementById('user-info');
        userInfoContainer.innerHTML = ''; // Xóa nội dung cũ

        const infoHTML = `
            <h2>Ảnh đại diện</h2>
            <img src="${infoUser.imageUrl || 'default-avatar.png'}" class="rounded-circle w-10">
            <div class="mb-3">
                <label for="updateImg" class="btn btn-primary">Chọn ảnh</label>
                <input type="file" id="updateImg" class="d-none">
            </div>                
            <hr class="my-2">
            <div class="row">
                <div class="col-6">
                    <div class="my-2">
                        <label for="fullname">Họ và tên</label>
                        <input class="form-control my-2" name="fullname" id="fullName" value="${infoUser.fullName || ''}" placeholder="Nhập họ và tên">
                    </div>
                    <div class="my-2">
                        <label for="province">Tỉnh/Thành phố</label>
                        <input class="form-control my-2" name="province" id="province" value="${infoUser.address || ''}" placeholder="Nhập tỉnh/thành phố">
                    </div>
                    <div class="my-2">
                        <label for="phoneNumber">Số điện thoại</label>
                        <input class="form-control my-2" name="phoneNumber" id="phoneNumber" value="${infoUser.phoneNumber || ''}" placeholder="Nhập số điện thoại">
                    </div>
                </div>
                <div class="col-6">
                    <div class="my-2">
                        <label for="email">Email</label>
                        <input class="form-control my-2" name="email" id="email" value="${infoUser.email || ''}" placeholder="Nhập email">
                    </div>
                    <div class="my-2">
                        <label for="address">Địa chỉ</label>
                        <input class="form-control my-2" name="address" id="address" value="${infoUser.address || ''}" placeholder="Nhập địa chỉ">
                    </div>
                    <div class="my-2">
                        <label for="birthday">Ngày sinh</label>
                        <input class="form-control my-2" type="date" name="birthday" id="birthday" value="${infoUser.birthday ? new Date(infoUser.birthday).toISOString().split('T')[0] : ''}" placeholder="Nhập ngày sinh">
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <button id="submitChangeInfomation" class="btn bg-custom text-white-custom mt-4">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Thay đổi thông tin
                </button>
            </div>
        `;

        userInfoContainer.innerHTML = infoHTML;

        document.getElementById('submitChangeInfomation').addEventListener('click', () => {
            updateUserInfo();
        });
    } catch (error) {
        alert(error.message);
    }
}

//thay đổi thông tin người dùng
async function updateUserInfo() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập trước khi thay đổi thông tin!");
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const birthdayString = document.getElementById('birthday').value;
        const avatar = document.getElementById("updateImg").files[0]; // Ảnh đại diện (nếu có)

        // Chuẩn bị dữ liệu JSON
        const userData = {
            fullName,
            phoneNumber,
            email,
            address,
            birthdayString
        };

        // Tạo FormData để gửi ảnh và JSON cùng lúc
        const formData = new FormData();
        formData.append("new_user_info", JSON.stringify(userData)); // Dữ liệu người dùng dạng JSON
        if (avatar) {
            formData.append("image", avatar); // Nếu có ảnh, thêm vào FormData
        }

        // Gọi API cập nhật thông tin
        const response = await fetch("http://localhost:8086/api/v1/user/change-user-information", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData // Gửi dữ liệu dạng multipart/form-data
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }

        alert("Cập nhật thông tin thành công!");
        getInfomationUser(); // Load lại thông tin mới
    } catch (error) {
        alert(`Lỗi cập nhật: ${error.message}`);
    }
}

//Lấy ra job đã thích
let currentPage = 0;
const pageSize = 5;
document.querySelector('a[href="#liked-job"]').addEventListener('shown.bs.tab', () => {
    currentPage = 0;
    getLikedJob(currentPage, pageSize);
});

async function getLikedJob(currentPage, pageSize) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập trước khi xem thông tin!");
            return;
        }

        const response = await fetch(`http://localhost:8086/api/v1/job/liked?page=${currentPage}&size=${pageSize}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }

        renderJobs(result.content);
        updatePagination(result, "pagination-1");
    } catch (error) {
        alert(error.message);
    }
}

function renderJobs(jobs) {
    const jobList = document.getElementById("jobList");
    if (!jobList) {
        console.error("Không tìm thấy phần tử jobList trong DOM");
        return;
    }
    jobList.innerHTML = "";

    jobs.forEach(job => {
        console.log(job);
        const jobItem = document.createElement("div");
        jobItem.classList.add("likedJob");
        const heartIconClass = job.hasLiked ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";
        jobItem.innerHTML = `
            <div class="position-relative job-card shadow p-2 mt-4">
                <div class="position-absolute top-0 end-0 p-3">
                    <i class="${heartIconClass} heart-icon"></i>
                </div>
    
                <div class="d-flex flex-column mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${job.imageUrl}" class="rounded-circle w-10">
        
                        <div class="ms-3">
                            <p class="my-2">${job.jobName}</p>
                            <P class="mb-2">${job.nameRecruiter}</P>
                            <div class="d-flex align-items-center mb-2">
                                <i class="fa-solid fa-circle-dollar-to-slot me-2"></i>
                                <p class="text-custom mb-0">${job.minSalary} - ${job.maxSalary} Triệu</p>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <i class="fa-solid fa-location-dot me-2"></i>
                                <p class="text-custom mb-0">${job.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="my-2">
                <div class="d-flex justify-content-end align-items-center">
                    <i class="fa-solid fa-calendar-days me-2"></i>
                    <p class="text-custom mb-0">${job.expirationDate}</p>
                </div>
            </div>
        `;

        const heartIcon = jobItem.querySelector(".heart-icon");

        heartIcon.addEventListener("click", (event) => {
            event.stopPropagation();

            job.hasLiked = !job.hasLiked;

            if (job.hasLiked) {
                heartIcon.classList.remove("fa-regular");
                heartIcon.classList.add("fa-solid", "text-danger");
                toggleLikeJob(job.id);
            } else {
                heartIcon.classList.remove("fa-solid", "text-danger");
                heartIcon.classList.add("fa-regular");
                toggleRemoveLikeJob(job.id);
            }
        });

        jobItem.addEventListener('click', () => {
            window.location.href = `/components/job-descriptions/job-descriptions.html?jobId=${job.id}`; // Redirect to the product details page
        });
        jobList.appendChild(jobItem);
    });
}

function updatePagination(data, paginationId) {
    const pagination = document.getElementById(paginationId);
    pagination.innerHTML = '';

    const totalPages = data.totalPages || Math.ceil(data.totalElements / pageSize);
    if (!totalPages || totalPages <= 1) return;

    const maxVisibleButtons = 5;

    const createButton = (page, text = page + 1, isDisabled = false) => {
        const button = document.createElement('button');
        button.innerText = text;
        button.classList.add('btn', 'btn-outline-primary', 'mx-1');
        if (isDisabled) button.classList.add('disabled');
        if (page === currentPage) button.classList.add('active');

        button.addEventListener('click', () => {
            if (page !== currentPage) {
                currentPage = page;
                getLikedJob(currentPage, pageSize);
                loadJobsByState();
            }
        });

        pagination.appendChild(button);
    };

    if (currentPage > 0) createButton(currentPage - 1, '«');

    if (totalPages <= maxVisibleButtons) {
        // Hiển thị toàn bộ nếu số trang nhỏ
        for (let i = 0; i < totalPages; i++) createButton(i);
    } else {
        // Hiển thị trang đầu tiên
        createButton(0);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages - 2, currentPage + 2);

        if (currentPage <= 2) {
            endPage = 4;
        } else if (currentPage >= totalPages - 3) {
            startPage = totalPages - 5;
        }

        if (startPage > 1) {
            createButton(null, '...', true); // Dấu "..."
        }

        for (let i = startPage; i <= endPage; i++) {
            createButton(i);
        }

        if (endPage < totalPages - 2) {
            createButton(null, '...', true); // Dấu "..."
        }

        // Hiển thị trang cuối cùng
        createButton(totalPages - 1);
    }

    // Nút "Sau"
    if (currentPage < totalPages - 1) createButton(currentPage + 1, '»');
}

document.querySelector('a[href="#applied-job"]').addEventListener('shown.bs.tab', () => {
    currentPage = 0;
    loadJobsByState();
});

async function loadJobsByState() {
    try {
        const state = document.getElementById('jobState').value;
        const accessToken = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:8086/api/v1/job/state?state=${state}&page=${currentPage}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.data.message);
        }

        const jobs = result.content;
        const jobListContent = document.getElementById('job-list');
        jobListContent.innerHTML = '';

        jobs.forEach(job => {
            const jobItem = document.createElement('div');
    
            jobItem.innerHTML = `
                <div class="position-relative job-card shadow p-2 mt-4">
                    <div class="d-flex flex-column mb-2">
                        <div class="d-flex align-items-center">
                            <img src="${job.imageUrl}" class="rounded-circle w-10">
        
                            <div class="ms-3">
                                <p class="my-2">${job.jobName}</p>
                                <P class="mb-2">${job.nameRecruiter}</P>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fa-solid fa-circle-dollar-to-slot me-2"></i>
                                    <p class="text-custom mb-0">${job.minSalary} - ${job.maxSalary} Triệu</p>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fa-solid fa-location-dot me-2"></i>
                                    <p class="text-custom mb-0">${job.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="my-2">
                    <div class="d-flex justify-content-end align-items-center">
                        <i class="fa-solid fa-calendar-days me-2"></i>
                        <p class="text-custom mb-0">${job.expirationDate}</p>
                    </div>
                </div>
            `;
            jobListContent.appendChild(jobItem);
            jobItem.addEventListener('click', () => {
                window.location.href = `/components/job-descriptions/job-descriptions.html?jobId=${job.id}`; // Redirect to the product details page
            });
        });
        updatePagination(result, "pagination");
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

window.loadJobsByState = loadJobsByState;

document.addEventListener("DOMContentLoaded", function () {
    getInfomationUser()
});