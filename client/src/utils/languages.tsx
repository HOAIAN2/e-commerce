const languagesSupported = [
    'vi',
    'en'
]

function getLanguage() {
    const language = navigator.language.includes('en') ? 'en' : navigator.language
    if (languagesSupported.includes(language)) return language
    return 'en'
}

export {
    getLanguage
}