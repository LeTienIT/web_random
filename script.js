const box = document.querySelector('.box'); // Chọn khối xoay
let isPaused = false; // Trạng thái dừng
let animationFrame; // Biến lưu requestAnimationFrame
const body = document.body; // Chọn phần tử body để đổi nền
const overlay = document.querySelector('.overlay');

document.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;

        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = 1; // Tăng độ đậm
            overlay.style.transform = 'translate(-50%, -50%) scale(30)'; // Phóng to đến full màn hình
        }, 1000);

        // Lấy trạng thái xoay hiện tại
        const computedStyle = getComputedStyle(box);
        const currentTransform = computedStyle.transform;

        // Dừng animation và giữ nguyên trạng thái
        box.style.animation = 'none';
        box.style.transform = currentTransform;

        let duration = 20; // Thời gian chu kỳ ban đầu (20s)
        let distance = 400; // Khoảng cách ban đầu giữa các ảnh (translateZ)
        let opct = 0; // Độ mờ ban đầu của overlay
        let scal = 1; // Kích thước ban đầu của overlay
        const targetDuration = 0.2; // Thời gian chu kỳ mục tiêu (0.2s)
        const targetDistance = 0; // Khoảng cách mục tiêu (tập trung hoàn toàn ở giữa)
        const targetScale = 50; // Kích thước tối đa của overlay
        const targetOpacity = 1; // Độ mờ tối đa của overlay
        const startTime = performance.now(); // Lấy thời gian bắt đầu

        const accelerate = (currentTime) => {


            const elapsedTime = (currentTime - startTime) / 1000; // Thời gian đã trôi qua (giây)

            // Nội suy (linear interpolation) giữa thời gian và khoảng cách
            duration = Math.max(targetDuration, 20 - (elapsedTime * 10)); // Giảm dần về 0.2s
            distance = Math.max(targetDistance, 400 - (elapsedTime * 400)); // Giảm dần về 0
            opct = Math.min(1, opct + 0.02); // Tăng opacity dần dần từ 0 đến 1
            scal = Math.min(50, scal + 0.5); // Tăng scale dần dần từ 0 lên 50
            overlay.style.opacity = opct;
            overlay.style.transform = `translate(-50%, -50%) scale(${scal})`;

            // Cập nhật animation và khoảng cách
            box.style.animation = `ani-fast ${duration}s linear infinite`;
            box.style.setProperty('--distance', `${distance}px`);

            // Hiệu ứng nhấp nháy nền
            if (Math.floor(elapsedTime * 10) % 2 === 0) {
                body.style.backgroundColor = `rgba(${Math.random() * 255}, 0, 0, 0.8)`; // Đỏ ngẫu nhiên
            } else {
                body.style.backgroundColor = `rgba(0, 0, 0, 1)`; // Trở về đen
            }

            // Tiếp tục hoặc dừng lại nếu đạt mục tiêu
            if (duration > targetDuration || distance > targetDistance) {
                animationFrame = requestAnimationFrame(accelerate);
            } else {
                cancelAnimationFrame(animationFrame);
                body.style.backgroundColor = `black`; // Reset nền khi kết thúc
                isPaused = false; // Cho phép nhấn lại
            }
        };

        animationFrame = requestAnimationFrame(accelerate);
    }
});
