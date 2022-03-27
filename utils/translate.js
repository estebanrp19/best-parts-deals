const translate = (key, lang, params) => {
    const languageSelected = $('#select-idioma').val();
    let strTarget = langTranlate[lang ? lang : languageSelected][key];

    if (params) {
        params.forEach((element, index) => {
            strTarget = strTarget.replace('@@' + index, element);
        });
    }
    return strTarget
}