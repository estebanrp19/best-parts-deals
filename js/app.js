$(document).ready(function () {

    const translator = $('body').translate({ lang: "en", t: dict }); //English use by default

    API_NODE.GET_REGIONS().then((res) => {
        res.forEach(element => {
            $("#select-region").append('<option value="' + element.ALMACEN_ID + '">' + element.REGION_NAME + '</option>')
        });
    });

    $("#select-idioma").on("change", function () {
        const langSelected = $(this).val();
        if (langSelected == "") {
            translator.lang("en"); //English use by default 
        } else {
            translator.lang($(this).val());
        }
    })
});