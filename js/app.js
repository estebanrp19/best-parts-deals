var configGeneral;
const appState = {};
var BPD_IMAGES_URL;
$(document).ready(function () {

    const translator = $('body').translate({ lang: "en", t: dict }); //English use by default
    const api = new Api();
    spinner.show();

    const updateState = (e) => {
        console.log($('#select-model').val())
        appState.brand = $('#select-brand').val();
        appState.model = $('#select-model').val();
        appState.modelYears = parseInt($('#model-year').val());
        appState.inputFilterText = $('#input-filter-text').val();
    }

    $(document).on("updateState", updateState);

    api.loadInitialData().then((res) => {

        configGeneral = res.configGeneral[0];
        BPD_IMAGES_URL = configGeneral.filter((item) => item.CATEGORIA == 'BPD_IMAGES_URL')[0].VALOR;

        res.regions[0].forEach(element => {
            $("#select-region").append('<option value="' + element.ALMACEN_ID + '">' + element.REGION_NAME + '</option>')
        });

        res.brands[0].forEach(element => {
            $("#select-brand").append('<option value="' + element + '">' + element + '</option>')
        });


        let modelYears = [];
        for (let i = res.initYears[0]; i <= res.endYears[1]; i++) {
            modelYears.push(i.toString())
        }

        $("#model-year").autocomplete({
            source: modelYears
        });

        spinner.stop();
    });


    $("#select-idioma").on("change", function () {
        const langSelected = $(this).val();
        if (langSelected == "") {
            translator.lang("en"); //English use by default 
        } else {
            translator.lang($(this).val());
        }
    });

    $("#select-brand").on("change", function () {
        $('#select-model')
            .find('option')
            .remove()
            .end()
            .append('<option value="" class="trn" data-trn-key="carModel_lbl">Model</option>');

        spinner.show();
        $.event.trigger({ type: 'updateState' });
        const brandSelected = $(this).val();

        filter = {
            brand: appState.brand,
            model: appState.model,
            year: appState.modelYears,
            inputFilterText: appState.inputFilterText
        };

        console.log(filter)

        api.GET_FILTERED_PARTS_LIST(filter).then((res) => {
            $('#products-list')
                .empty();

            res.forEach((item) => {
                $('#products-list')
                    .append(itemOnProductsList(item))
            });

            api.GET_MODELS(brandSelected).then((res) => {
                res.forEach(element => {
                    $("#select-model").append('<option value="' + element.model + '">' + element.model + '</option>')
                });
                spinner.stop();
            });
        });

    });

    $("#select-model").on("change", function () {
        $.event.trigger({ type: 'updateState' });

        filter = {
            brand: appState.brand,
            model: appState.model,
            year: appState.modelYears,
            inputFilterText: appState.inputFilterText
        };


        api.GET_FILTERED_PARTS_LIST(filter).then((res) => {
            $('#products-list')
                .empty();

            res.forEach((item) => {
                $('#products-list')
                    .append(itemOnProductsList(item))
            });
        })

    });

    $("#model-year").on("change", function () {
        console.log($(this).val())
    })
});