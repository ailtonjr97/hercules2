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

export function getAuthConfig2() {
    return {
        headers: {
            'Authorization': `jwt=${getCookie('jwt')}`,
            'Content-Type': 'application/pdf',
        },
        responseType: 'blob', // Para garantir que o arquivo seja tratado como um blob
    };
}