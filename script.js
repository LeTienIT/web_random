
let isPaused = false; // Kiểm soát dừng/tiếp tục
let isAnimating = 0; 

const box = document.querySelector('.box'); 
let animationFrame; // Biến lưu requestAnimationFrame
const body = document.body; 
const overlay = document.querySelector('.overlay');
const result = document.getElementById("result");
const codeRD = document.getElementById("codeRD");
const nameRD = document.getElementById("nameRD");
const imgSTART = document.getElementById("img-start");

let flowerInterval;

let randomData = [];  

const flowerImages = [
    'img/9.png', 
    'img/10.png', 
    'img/11.png', 
    'img/12.png' 
];

let rightClickCount = 0;
let rightClickTimer;

// Lắng nghe sự kiện chuột phải
document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Ngăn menu chuột phải

    if (rightClickTimer) clearTimeout(rightClickTimer); 

    rightClickCount++; // 

    if (rightClickCount === 2) {
        // Hiển thị giao diện nhập dữ liệu
        document.getElementById('dataSetup').style.display = 'block';
        rightClickCount = 0; // Reset đếm sau khi hiển thị
    } else {
        rightClickTimer = setTimeout(() => {
            rightClickCount = 0;
        }, 1000); 
    }
});

// Hàm lưu dữ liệu
function saveData() {
    const input = document.getElementById('dataInput').value.trim();
    if (!input) {
        alert("Vui lòng nhập dữ liệu!");
        return;
    }

    // Chia dữ liệu thành các dòng
    const lines = input.split('\n');
    const newData = lines.map(line => {
        const [code, name] = line.split(',');
        return { code: code?.trim(), name: name?.trim() };
    });

    randomData = [...randomData, ...newData];
    alert("Dữ liệu đã được lưu!");

    // Ẩn giao diện nhập dữ liệu
    document.getElementById('dataSetup').style.display = 'none';
    // console.log("Dữ liệu hiện tại:", randomData);
}

// Hàm xóa toàn bộ dữ liệu
function resetData() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu không?")) {
        randomData = [];
        document.getElementById('dataInput').value = '';
        alert("Dữ liệu đã được xóa!");
    }
}

function closeBox() {
    document.getElementById('dataSetup').style.display = 'none';
}

// 
document.addEventListener('keydown', (event) => {
    if (event.code === 'F2') {
            if (isAnimating == 1)
        {
            result;
        } 
        else if(isAnimating == 2)
        {
            resetAnimation();
        }
        else if(randomData.length > 0){
            const randomIndex = Math.floor(Math.random() * randomData.length);
            const randomItem = randomData[randomIndex];

            codeRD.innerText = randomItem.code;
            nameRD.innerText = randomItem.name
            
            randomData.splice(randomIndex, 1);

            isPaused = true;

            isPaused = true;
            isAnimating = 1; 

            body.style.background = 'linear-gradient(135deg, #8c4e52 0%, #7c5e69 30%, #724e83 60%, #354b52 100%)';

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
        else{
            alert("Dữ liệu chưa được thiết lập");
        }
    }
    
});

// Hàm hiệu ứng phóng to overlay
const startOverlayEffect = () => {
    overlay.style.display = 'block';
    let opct = 0; 

    const updateOverlay = () => {
        opct = Math.min(1, opct + 0.02); // Tăng opacity dần từ 0 đến 1

        overlay.style.opacity = opct;

        //đệ quy
        if (opct < 1) {
            // const randomDelay = Math.random() * 500 + 200; // Random delay từ 200ms đến 1s
            setTimeout(updateOverlay, 90); // Gọi lại hàm với độ trễ
        }else {
            box.style.display = 'none';
            body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 30%, #fbc2eb 60%, #8fd3f4 100%)';
            setTimeout(() => {
                overlay.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
                overlay.style.opacity = '1'; 
                overlay.style.boxShadow = 'none'; 

                setTimeout(() => {
                    fadeOutOverlay(); 
                }, 300);
            }, 100); 
        }
    };

    //Mờ nền => Mở thẻ trúng thưởng
    const fadeOutOverlay = () => {
        let fadeOpacity = 1; 
        result.style.display = 'flex';
        imgSTART.style.display = 'none';
        const fadeEffect = () => {
            fadeOpacity -= 0.02;
            overlay.style.opacity = fadeOpacity;
             
            if (fadeOpacity > 0) {
                requestAnimationFrame(fadeEffect);
            } else {
                overlay.style.display = 'none';
                startFallingFlowers();
                setTimeout(() => {
                    const card = document.querySelector('#result .card'); 
                    if (card) {
                        card.classList.add('hover'); 
                    }
                    isAnimating = 2;
                }, 3500);
            }
        };

        fadeEffect();
    };
    
    updateOverlay(); 
};

function createFlower() {
    const flowerContainer = document.getElementById('flower-container');

    // Tạo phần tử hoa
    const flower = document.createElement('div');
    flower.classList.add('flower');

    // Chọn ảnh hoa ngẫu nhiên
    const randomImage = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    flower.style.backgroundImage = `url(${randomImage})`;

    // Thiết lập vị trí, kích thước và thời gian rơi ngẫu nhiên
    flower.style.left = Math.random() * 100 + 'vw'; // Ngẫu nhiên vị trí ngang
    flower.style.animationDuration = Math.random() * 5 + 5 + 's'; // Thời gian rơi ngẫu nhiên
    flower.style.width = flower.style.height = Math.random() * 10 + 15 + 'px'; // Kích thước ngẫu nhiên

    flowerContainer.appendChild(flower);

    // Xóa phần tử hoa sau khi hoàn thành hoạt ảnh
    flower.addEventListener('animationend', () => {
        flower.remove();
    });
}

// Hoa rơi CỬA PHẬT
function startFallingFlowers() {
    if (flowerInterval) return;

    flowerInterval = setInterval(createFlower, 300); 
}

// Vạn vật về 0
function removeFallingFlowers() {
    if (flowerInterval) {
        clearInterval(flowerInterval);
        flowerInterval = null; 
    }

    const flowers = document.querySelectorAll('.flower');
    flowers.forEach(flower => flower.remove());
}
//reset
function resetAnimation(){

    removeFallingFlowers();

    imgSTART.style.display = 'block';

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

    isPaused = false;
    isAnimating = 0;
    
};

