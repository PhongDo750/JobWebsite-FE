import { toggleLikeJob } from "./interactWithJob.js";
import { toggleRemoveLikeJob } from "./interactWithJob.js";

let currentPage = 0;
const pageSize = 5;
let dynamicFilters = '';

document.getElementById("searchButton").addEventListener("click", function () {
    // Lấy giá trị từ các ô input
    const jobName = document.getElementById("jobName").value;
    const occupationName = document.getElementById("occupation").value;
    const experience = document.getElementById("experience").value;
    const province = document.getElementById("province").value;
    const jobType = document.getElementById("jobType").value;
    const jobLevel = document.getElementById("jobLevel").value;
    const minSalary = document.getElementById("minSalary").value;
    const maxSalary = document.getElementById("maxSalary").value;
    const educationLevel = document.getElementById("educationLevel").value;

    // Tạo object chứa tham số lọc
    const filters = {
        jobName: jobName || null,
        occupationName: occupationName || null,
        experience: experience || null,
        province: province || null,
        jobType: jobType || null,
        jobLevel: jobLevel || null,
        minSalary: minSalary ? parseFloat(minSalary) : null,
        maxSalary: maxSalary ? parseFloat(maxSalary) : null,
        educationLevel: educationLevel || null
    };

    dynamicFilters = filters;

    // Gọi API
    fetchJobs(dynamicFilters, currentPage, pageSize);
});

function fetchJobs(filters, currentPage, pageSize) {
    const baseUrl = "http://localhost:8086/api/v1/job/filter";
    const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== "")
    );

    const queryParams = new URLSearchParams(filteredParams).toString();
    const url = `${baseUrl}?${queryParams}&page=${currentPage}&size=${pageSize}`;

    console.log("API URL:", url);

    // Tạo headers
    const headers = {
        "Content-Type": "application/json",
    };

    const accessToken = localStorage.getItem('token');

    // Nếu có accessToken, thêm vào headers
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    fetch(url, {
        method: "GET",
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Lỗi: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Danh sách công việc:", data);
        localStorage.setItem("totalPages", data.totalPages);
        renderJobs(data.content);
        updatePagination(data);
    })
    .catch(error => console.error("Lỗi khi gọi API:", error));
}

// Hàm hiển thị danh sách công việc
function renderJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    if (jobs.length === 0) {
        jobList.innerHTML = "<p>Không tìm thấy công việc phù hợp.</p>";
        return;
    }

    jobs.forEach(job => {
        console.log(job);
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-list");
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
            localStorage.setItem("dynamicFilters", JSON.stringify(dynamicFilters)); // Lưu filter vào localStorage
            localStorage.setItem("currentPage", currentPage);
            window.location.href = `/components/job-descriptions/job-descriptions.html?jobId=${job.id}`; // Redirect to the product details page
        });
        jobList.appendChild(jobItem);
    });
}

function updatePagination(data) {
    const pagination = document.getElementById('pagination');
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
                fetchJobs(dynamicFilters, currentPage, pageSize);
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

//Xóa lọc
document.getElementById("clearFeild").addEventListener("click", function () {

    localStorage.removeItem("dynamicFilters");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("totalPages");
    localStorage.removeItem("nextPage");

    // Lấy giá trị từ các ô input
    document.getElementById("jobName").value = "";
    document.getElementById("experience").value = "";
    document.getElementById("jobType").value = "";
    document.getElementById("jobLevel").value = "";
    document.getElementById("minSalary").value = "";
    document.getElementById("maxSalary").value = "";
    document.getElementById("educationLevel").value = "";
    document.getElementById("province").value = "";
    document.getElementById("occupation").value = "";

    fetchJobs(" ", currentPage, pageSize);
});

document.addEventListener("DOMContentLoaded", function () {
    const savedFilters = JSON.parse(localStorage.getItem("dynamicFilters")) || {};
    const savedPage = localStorage.getItem("currentPage");
    console.log(savedFilters);
    if (savedFilters === null) {
        fetchJobs(" ", currentPage, pageSize);
    } else {
        fetchJobs(savedFilters, savedPage, pageSize);
    }
    console.log("da vao");
});
