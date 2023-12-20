export function getTimePassed(timestamp) {
    if (!timestamp) return;
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;
    // Possible time units: seconds, minutes, hours, days, weeks, months, years
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) {
        return `${years} năm trước`;
    }
    if (months > 0) {
        return `${months} tháng trước`;
    }
    if (weeks > 0) {
        return `${weeks} tuần trước`;
    }
    if (days > 0) {
        return `${days} ngày trước`;
    }
    if (hours > 0) {
        return `${hours} giờ trước`;
    }
    if (minutes > 0) {
        return `${minutes} phút trước`;
    }
    if (seconds > 0) {
        return `${seconds} giây trước`;
    }
}