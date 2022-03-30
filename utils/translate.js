const translate = (key, lang, params) => {
    languageSelected = lang ? lang : $('#select-idioma').val();
    let strTarget = langTranlate[languageSelected][key];

    if (params) {
        params.forEach((element, index) => {
            strTarget = strTarget.replace('@@' + index, element);
        });
    }
    return strTarget
}