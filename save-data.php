<?php
// Đặt tên file để lưu và đọc dữ liệu
$file = 'dataRandom.txt';

// Nếu yêu cầu là GET, đọc dữ liệu từ file và trả về
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Kiểm tra xem file có tồn tại không
    if (file_exists($file)) {
        // Đọc toàn bộ nội dung của file
        $file_content = file_get_contents($file);
        
        // Nếu file không rỗng, trả về dữ liệu
        if (!empty($file_content)) {
            // Tách dữ liệu thành mảng
            $lines = explode("\n", $file_content);
            $data = [];
            foreach ($lines as $line) {
                // Kiểm tra xem dòng có chứa dấu phân cách " - " không
                if (strpos($line, " - ") !== false) {
                    // Tách từng dòng thành code và tên
                    list($code, $name) = explode(" - ", $line);
                    $data[] = ['code' => trim($code), 'name' => trim($name)];
                }
            }
            // Kiểm tra nếu mảng dữ liệu có phần tử
            if (count($data) > 0) {
                echo json_encode($data);
            } else {
                echo json_encode(["message" => "Không có dữ liệu hợp lệ trong file!"]);
            }
        } else {
            // Nếu file trống, trả về thông báo
            echo json_encode(["message" => "File dữ liệu trống!"]);
        }
    } else {
        // Nếu file không tồn tại, trả về thông báo lỗi
        echo json_encode(["message" => "File không tồn tại!"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Xử lý lưu dữ liệu (giống như trước)
    $data = file_get_contents('php://input');
    if (!empty($data)) {
        $json_data = json_decode($data, true);
        $data_to_write = "";
        foreach ($json_data as $item) {
            $data_to_write .= $item['code'] . ' - ' . $item['name'] . "\n";
        }
        if (file_put_contents($file, $data_to_write, FILE_APPEND)) {
            echo json_encode(["message" => "Dữ liệu đã được lưu!"]);
        } else {
            echo json_encode(["message" => "Lỗi khi lưu dữ liệu!"]);
        }
    } else {
        echo json_encode(["message" => "Không có dữ liệu để lưu!"]);
    }
}
?>
