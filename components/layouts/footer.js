function loadFooter(targetElement) {
    const footerHTML = `
    <div class="container mt-4">
        <div class="row shadow rounded-2 px-3 py-4">
            <div class="col-5 text-center align-items-center">
                <h2 class="my-4">Hotline cho người tìm việc</h2>
                <div class="row align-items-center">
                    <div class="col-6 text-center">
                        <div class="mb-2">
                            <i class="fa-solid fa-headphones-simple"></i>
                            <span>Hỗ trợ miền Nam</span>
                        </div>
                        <span class="text-custom">HCM : 0961246358</span>
                    </div>

                    <div class="col-6 text-center">
                        <div class="mb-2">
                            <i class="fa-solid fa-headphones-simple"></i>
                            <span>Hỗ trợ miền Bắc</span>
                        </div>
                        <span class="text-custom">HN : 0961246358</span>
                    </div>
                </div>
            </div>

            <div class="col-2 d-flex justify-content-center align-items-center">
                <div class="border-end" style="height: 150px;"></div>
            </div>

            <div class="col-5 text-center align-items-center">
                <h2 class="my-4">Hotline cho nhà tuyển dụng</h2>
                <div class="row align-items-center">
                    <div class="col-6 text-center">
                        <div class="mb-2">
                            <i class="fa-solid fa-headphones-simple"></i>
                            <span>Hỗ trợ miền Nam</span>
                        </div>
                        <span class="text-custom">HCM : 0961246358</span>
                    </div>

                    <div class="col-6 text-center">
                        <div class="mb-2">
                            <i class="fa-solid fa-headphones-simple"></i>
                            <span>Hỗ trợ miền Bắc</span>
                        </div>
                        <span class="text-custom">HN : 0961246358</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="w-100 mt-3">
        <div class="row shadow rounded-2 p-5 align-items-center">
            <div class="col-6">
                <h5 class="mb-3">Về chúng tôi</h5>
                <p class="text-custom">
                    Vieclam24h.vn - Công Ty Cổ Phần Việc Làm 24h
                    <br>
                    Phòng 102, Tòa nhà 20-20B Trần Cao Vân, Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh
                    <br>
                    Chi nhánh: Tầng 4, tòa nhà Times Tower, 35 Lê Văn Lương, Thanh Xuân, Hà Nội.
                    <br>
                    Giấy phép hoạt động dịch vụ việc làm số: 5825/2024/19/SLĐTBXH-VLATLĐ do Sở Lao Động 
                    <br>
                    Thương Binh & Xã Hội TP.HCM cấp ngày 27/03/2024
                    <br>
                    Điện thoại: (028) 7108 2424 | (024) 7308 2424
                    <br>
                    Email hỗ trợ người tìm việc: ntv@vieclam24h.vn
                    <br>
                    Email hỗ trợ nhà tuyển dụng: ntd@vieclam24h.vn
                </p>
            </div>

            <div class="col-2">
                <h5 class="mb-3">Thông tin</h5>
                <p>
                    Cẩm nang nghề nghiệp
                    <br>
                    Báo giá dịch vụ
                    <br>
                    Điều khoản sử dụng
                    <br>
                    Quy định bảo mật
                    <br>
                    Sơ đồ trang web
                    <br>
                    Chính sách dữ liệu cá nhân
                    <br>
                    Tuân thủ và sự đồng ý của Khách Hàng
                </p>
            </div>

            <div class="col-4 text-center">
                <h5 class="mb-3">Kết nối với chúng tôi</h5>
                <div class="d-flex justify-content-center fs-3">
                    <div class="mx-3">
                        <i class="fa-brands fa-facebook"></i>
                    </div>
                        
                    <div class="mx-3">
                        <i class="fa-brands fa-tiktok"></i>
                    </div>

                    <div class="mx-3">
                        <i class="fa-brands fa-instagram"></i>
                    </div>

                    <div class="mx-3">
                        <i class="fa-brands fa-youtube"></i>
                    </div>

                    <div class="mx-3">
                        <i class="fa-brands fa-linkedin"></i>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;
    document.getElementById(targetElement).innerHTML = footerHTML
}