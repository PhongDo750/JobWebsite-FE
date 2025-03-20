document.addEventListener("DOMContentLoaded", function () {
    function loadDropdownData(inputId, listId, dataUrl, selectCallback) {
        const inputElement = document.getElementById(inputId);
        const listElement = document.getElementById(listId);

        inputElement.addEventListener("click", function () {
            listElement.classList.add("show");
            listElement.innerHTML = '<li class="dropdown-item text-center">Đang tải...</li>'; // Hiện loading
            
            // Fetch dữ liệu từ file JSON
            fetch(dataUrl)
                .then(response => response.json())
                .then(data => {
                    renderList(data, listElement, selectCallback);
                    
                    // Lắng nghe sự kiện nhập vào ô input để gợi ý
                    inputElement.addEventListener("input", function () {
                        const filter = this.value.toLowerCase();
                        const filteredItems = data.filter(item => item.toLowerCase().includes(filter));
                        renderList(filteredItems, listElement, selectCallback);
                    });
                })
                .catch(error => {
                    console.error("Lỗi khi tải dữ liệu:", error);
                    listElement.innerHTML = '<li class="dropdown-item text-danger text-center">Lỗi tải dữ liệu</li>';
                });
        });        

        // Đóng dropdown khi click ra ngoài
        document.addEventListener("click", function (event) {
            if (!inputElement.parentElement.contains(event.target)) {
                listElement.classList.remove("show");
            }
        });
    }

    function renderList(items, listElement, selectCallback) {
        listElement.innerHTML = ""; // Xóa loading
        if (items.length === 0) {
            listElement.innerHTML = '<li class="dropdown-item text-center">Không có dữ liệu</li>';
        } else {
            items.forEach(item => {
                let listItem = document.createElement("li");
                listItem.innerHTML = `<a class="dropdown-item" href="#">${item}</a>`;
                listItem.addEventListener("click", function () {
                    selectCallback(item);
                    listElement.classList.remove("show");
                });
                listElement.appendChild(listItem);
            });
        }
    }

    function selectOccupation(occupation) {
        document.getElementById("occupation").value = occupation;
    }

    function selectProvince(province) {
        document.getElementById("province").value = province;
    }

    function selectExperience(experience) {
        document.getElementById("experience").value = experience;
    }

    function selectJobLevel(jobLevel) {
        document.getElementById("jobLevel").value = jobLevel;
    }

    function selectEducationLevel(educationLevel) {
        document.getElementById("educationLevel").value = educationLevel;
    }

    function selectTypeLevel(jobType) {
        document.getElementById("jobType").value = jobType;
    }

    // Áp dụng cho nghề nghiệp và tỉnh thành
    loadDropdownData("occupation", "occupationList", "/js/statics/occupations.json", selectOccupation);
    loadDropdownData("province", "provinceList", "/js/statics/provinces.json", selectProvince);
    loadDropdownData("experience", "experienceList", "/js/statics/experience.json", selectExperience);
    loadDropdownData("jobLevel", "jobLevelList", "/js/statics/jobLevel.json", selectJobLevel);
    loadDropdownData("educationLevel", "educationLevelList", "/js/statics/educationLevel.json", selectEducationLevel);
    loadDropdownData("jobType", "jobTypeList", "/js/statics/jobType.json", selectTypeLevel);
});

