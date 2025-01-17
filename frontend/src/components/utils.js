// utils.js
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract the parts of the date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = date.getDate();

    // Return the formatted date
    return `${year}-${month}-${day}`;
};

export const formatNumber = (number) => {
    if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(1) + 'M';
    } else if (number >= 1_000) {
        return (number / 1_000).toFixed(1) + 'K';
    }
    return number.toString();
};