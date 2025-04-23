// Helper function to capitalize the first letter of each word
export const capitalizeWords = (string) => {
    if (!string) return '';
    return string
        .toLowerCase() // Ensure consistent starting case
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
