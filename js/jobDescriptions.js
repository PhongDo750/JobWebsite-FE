import { toggleLikeJob, toggleRemoveLikeJob } from "./interactWithJob.js";

async function getJobDescription(jobId) {

    const accessToken = localStorage.getItem("token");

    const headers = {
        
    };
    
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }


    try {
        const response = await fetch(`http://localhost:8086/api/v1/job/descriptions?jobId=${jobId}`, {
            method: "GET",
            headers: headers
        });

        const result = await response.json();
        console.log(response);
        console.log(result);

        if (!response.ok) {
            throw new Error(result.message);
        }

        const job = result.data;
        const jobData = document.getElementById("job");
        jobData.innerHTML = "";

        const jobDescription = document.getElementById("jobDescriptions");
        jobDescription.innerHTML = "";

        const heartIconClass = job.hasLiked ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";

        const jobHTML = `
            <div class="position-relative job-card shadow p-2 mt-4">
                <div class="position-absolute top-0 end-0 p-3">
                    <i class="${heartIconClass} heart-icon" data-job-id="${job.id}"></i>
                </div>

                <div class="d-flex flex-column mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${job.userOutput.imageUrl}" class="rounded-circle w-15-custom">
        
                        <div class="ms-5">
                            <p class="my-3 fs-3">${job.jobName}</p>
                            <h2 class="my-3 text-bold">${job.userOutput.fullName}</h2>
                            <div class="d-flex align-items-center my-3">
                                <i class="fa-solid fa-circle-dollar-to-slot me-2"></i>
                                <p class="text-custom mb-0 me-4">${job.minSalary} - ${job.maxSalary} Triệu</p>

                                <i class="fa-solid fa-calendar-days me-2"></i>
                                <p class="mb-0 me-4">${job.expirationDate}</p>

                                <i class="fa-solid fa-location-dot me-2"></i>
                                <p class="mb-0">${job.address}</p>
                            </div>
                            <div class="d-flex align-items-center my-3">
                                <i class="fa-solid fa-bullhorn me-2 text-089468-custom"></i>
                                <span class="text-089468-custom">
                                    Cơ hội hấp dẫn !
                                </span>
                                <span> Công việc đang rất được quan tâm! Ứng tuyển ngay để không lỡ cơ hội!</span>
                            </div>

                            <button id="submitApplication" class="btn bg-custom text-white-custom w-25">
                                <i class="fa-solid fa-paper-plane"></i>
                                Ứng tuyển ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const jobDescriptionHTML = `
            <div class="row p-3">
                <h2>Thông tin chung</h2>
                <div class="col-6 d-flex flex-column justify-content-start">
                    <span class="my-2">Số lượng tuyển: ${job.headCount}</span>
                    <span class="my-2">Yêu cầu kinh nghiệm: ${job.experience}</span>
                    <span class="my-2">Ngành nghề: ${job.occupationName}</span>
                </div>

                <div class="col-6 d-flex flex-column justify-content-start">
                    <span class="my-2">Cấp bậc: ${job.jobLevel}</span>
                    <span class="my-2">Hình thức làm việc: ${job.jobType}</span>
                </div>
            </div>

            <div class="row p-3">
                <h2>Mô tả công việc</h2>
                <p class="ps-4 point5-custom">${job.descriptions}</p>
            </div>

            <div class="row p-3">
                <h2>Yêu cầu công việc</h2>
                <p class="ps-4 point5-custom">${job.requiredJobList}</p>
            </div>

            <div class="row p-3">
                <h2>Quyền lợi</h2>
                <p class="ps-4 point5-custom">${job.employeeBenefitList}</p>
            </div>
        `;

        jobData.innerHTML = jobHTML;
        jobDescription.innerHTML = jobDescriptionHTML;

        // Xử lý sự kiện click cho icon trái tim
        const heartIcon = document.querySelector(".heart-icon");
        if (heartIcon) {
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
        }

        let totalPages = parseInt(localStorage.getItem("totalPages")) || 1;
        if (totalPages <= 1) {
            totalPages = 1;
        } else {
            totalPages = Math.floor(Math.random() * totalPages);
        }

        fetchJobs(job.occupationName, totalPages - 1, 5, job.id);

        addSubmitEvent();
    } catch (error) {
        alert(error.message);
    }
}

function fetchJobs(filters, currentPage, pageSize, id) {
    const baseUrl = "http://localhost:8086/api/v1/job/filter";
    const url = `${baseUrl}?occupationName=${filters}&page=${currentPage}&size=${pageSize}`;

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
        renderJobs(data.content, id);
    })
    .catch(error => console.error("Lỗi khi gọi API:", error));
}

// Hàm hiển thị danh sách công việc
function renderJobs(jobs, id) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    console.log(jobs.length);

    if (jobs.length - 1 === 0) {
        jobList.classList.add("ad-container", "text-center");
        jobList.innerHTML = `
            <img src="/assets/image/270x600-125CC20TU9BA3U20(1)_173701742759.webp" class="w-100" style="max-height: 600px; object-fit: cover;">
        `;
        return;
    } else {
        jobList.classList.remove("ad-container", "text-center"); // Xóa class nếu có job
    }

    jobs.forEach(job => {
        if (job.id === id) return;
        console.log(job);
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-list");
        const heartIconClass = job.hasLiked ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";
        jobItem.innerHTML = `
            <div class="position-relative job-card shadow p-2">
                <div class="position-absolute top-0 end-0 p-3">
                    <i class="${heartIconClass} heart-icon"></i>
                </div>
    
                <div class="d-flex flex-column mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${job.imageUrl}" class="rounded-circle w-10">
        
                        <div class="ms-3">
                            <p class="my-2 text-truncate" style="max-width: 200px">${job.jobName}</p>
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

document.getElementById('submitForm').addEventListener('click', () => {
    const jobId = getQueryParameter('jobId');
    appliedJob(jobId);
});

async function appliedJob(jobId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập trước khi thay đổi thông tin!");
            return;
        }

        // Lấy nút "Gửi đơn"
        const submitButton = document.getElementById("submitForm");
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Đang gửi...`;

        const introductions = document.getElementById('coverLetter').value.replace(/\n/g, "<br>");
        const filePDF = document.getElementById("resumeFile").files[0];

        const userData = {
            introductions,
            jobId
        };

        // Tạo FormData để gửi ảnh và JSON cùng lúc
        const formData = new FormData();
        formData.append("job_application", JSON.stringify(userData));
        formData.append("file", filePDF);

        // Gọi API cập nhật thông tin
        const response = await fetch("http://localhost:8086/api/v1/interact/apply", {
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

        alert("Nộp đơn ứng tuyển thành công");
        let modalElement = document.getElementById("applicationForm");
        let modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        alert(error.message);
    } finally {
        const submitButton = document.getElementById("submitForm");
        submitButton.disabled = false;
        submitButton.innerHTML = "Gửi đơn";
    }
}

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function addSubmitEvent() {
    const submitBtn = document.getElementById("submitApplication");
    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            let modal = new bootstrap.Modal(document.getElementById("applicationForm"));
            modal.show();
        });
    } else {
        console.error("Không tìm thấy nút submitApplication trong DOM");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const jobId = getQueryParameter('jobId');
    if (jobId) {
        console.log("Lấy ID thành công:", jobId);
        getJobDescription(jobId);
    } else {
        console.error('Không tìm thấy jobId trong URL');
    }
});