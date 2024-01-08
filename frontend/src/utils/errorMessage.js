export default function errorMessage(error) {
    switch (error) {
        case 'INVALID_SESSION':
            return 'Phiên làm việc không hợp lệ.';
        case 'INVALID_REQUEST':
            return 'Yêu cầu không hợp lệ.';
        case 'IMAGE_VALIDATION_ERROR':
            return 'Ảnh không hợp lệ.';
        case 'IMAGE_LIMIT_EXCEEDED':
            return 'Chỉ được đăng tối đa 1 ảnh.';
        case 'IMAGE_UPLOAD_FAILED':
            return 'Tải ảnh lên thất bại.';
        case 'INTERNAL_SERVER_ERROR':
            return 'Lỗi máy chủ.';
        case 'NOT_FOUND':
            return 'Không tìm thấy.';
        case 'USER_BANNED':
            return 'Người dùng đã bị ban.';
        case 'PAGE_NOT_FOUND':
            return 'Không tìm thấy trang.';
        default:
            return 'Lỗi không xác định.';
    }
}