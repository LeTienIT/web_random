
let isPaused = false; // Kiểm soát dừng/tiếp tục
let isAnimating = 0; 

const box = document.querySelector('.box'); // Chọn khối xoay
let animationFrame; // Biến lưu requestAnimationFrame
const body = document.body; // Chọn phần tử body để đổi nền
const overlay = document.querySelector('.overlay');
const result = document.getElementById("result");
document.addEventListener('click', () => {
    if (isAnimating == 1)
    {
        result;
    } 
    else if(isAnimating == 2)
    {
        resetAnimation();
    }
    else{
        isPaused = true;

        isPaused = true;
        isAnimating = 1; // Đặt trạng thái animating

        // Lấy trạng thái xoay hiện tại
        const computedStyle = getComputedStyle(box);
        const currentTransform = computedStyle.transform;

        // Dừng animation và giữ nguyên trạng thái
        box.style.animation = 'none';
        box.style.transform = currentTransform;

        let duration = 20; // Thời gian chu kỳ ban đầu (20s)
        let distance = 400; // Khoảng cách ban đầu giữa các ảnh (translateZ)

        const targetDuration = 0.2; // Thời gian chu kỳ mục tiêu (0.2s)
        const targetDistance = 0; // Khoảng cách mục tiêu (tập trung hoàn toàn ở giữa)

        const startTime = performance.now(); // Lấy thời gian bắt đầu

        const accelerate = (currentTime) => {

            const elapsedTime = (currentTime - startTime) / 1000; // Thời gian đã trôi qua (giây)

            // Nội suy (linear interpolation) giữa thời gian và khoảng cách
            duration = Math.max(targetDuration, 20 - (elapsedTime * 10)); // Giảm dần về 0.2s
            distance = Math.max(targetDistance, 400 - (elapsedTime * 400)); // Giảm dần về 0

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
                const randomDelay = Math.random() * 2 + 1; 
                setTimeout(() => {
                    startOverlayEffect(); // Bắt đầu hiệu ứng overlay
                }, randomDelay * 1000);
            }
        };

        animationFrame = requestAnimationFrame(accelerate);
    }
});

// Hàm hiệu ứng phóng to overlay
const startOverlayEffect = () => {
    overlay.style.display = 'block';
    let opct = 0; // Đặt lại giá trị opacity

    const updateOverlay = () => {
        // Tăng opacity và scale với easing
        opct = Math.min(1, opct + 0.02); // Tăng opacity dần từ 0 đến 1

        // Áp dụng các thay đổi cho overlay
        overlay.style.opacity = opct;

        // Kiểm tra dừng khi đã đạt scale và opacity mục tiêu
        if (opct < 1) {
            // const randomDelay = Math.random() * 500 + 200; // Random delay từ 200ms đến 1s
            setTimeout(updateOverlay, 90); // Gọi lại hàm với độ trễ
        }else {
            box.style.display = 'none';
            setTimeout(() => {
                overlay.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
                overlay.style.opacity = '1'; 
                overlay.style.boxShadow = 'none'; 

                setTimeout(() => {
                    fadeOutOverlay(); // Bắt đầu mờ dần
                }, 300);
            }, 100); 
        }
    };

    const fadeOutOverlay = () => {
        let fadeOpacity = 1; 

        const fadeEffect = () => {
            fadeOpacity -= 0.02;
            overlay.style.opacity = fadeOpacity;
            result.style.display = 'flex'; 
            if (fadeOpacity > 0) {
                requestAnimationFrame(fadeEffect);
            } else {
                overlay.style.display = 'none';
                setTimeout(() => {
                    const card = document.querySelector('#result .card'); 
                    if (card) {
                        card.classList.add('hover'); 
                    }
                    isAnimating = 2;
                }, 1000);
            }
        };

        fadeEffect();
    };
    
    updateOverlay(); 
};

function resetAnimation(){
    isPaused = false;
    isAnimating = 0;

    box.style.animation = 'ani 20s linear infinite'; // Animation ban đầu
    box.style.transform = ''; // Xóa transform hiện tại
    box.style.setProperty('--distance', '400px'); // Khoảng cách ban đầu

    // Hiển thị lại các ảnh và overlay
    overlay.style.display = 'none';
    overlay.style.opacity = '0';
    overlay.style.transition = '';

    result.style.display = 'none';
    box.style.display = 'block';

    const card = document.querySelector('#result .card'); 
    if (card) {
        card.classList.remove('hover'); 
    }
    
};