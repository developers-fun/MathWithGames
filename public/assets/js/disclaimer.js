window.onload = () => {
    if (Cookies.get('shown') == 'true') {
        window.location.href = 'https://coldnova.xyz/';
    }
}

document.querySelector('button').addEventListener('click', () => {
    Cookies.set('shown', 'true', {expires: 365});
    window.open('https://coldnova.xyz/', '_blank');
});