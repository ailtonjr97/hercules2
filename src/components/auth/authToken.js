export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function getAuthConfig() {
    return {
        headers: {
            'Authorization': `jwt=${getCookie('jwt')}`,
        }
    };
}