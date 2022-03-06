var configGeneral;
const appState = { carShopList: [], filterErrors: [] };
var BPD_IMAGES_URL;
$(document).ready(function () {

    const translator = $('body').translate({ lang: "en", t: dict }); //English use by default
    const api = new Api();
    spinner.show();

    const updateState = (e) => {
        appState.brand = $('#select-brand').val();
        appState.model = $('#select-model').val();
        appState.modelYears = parseInt($('#model-year').val());
        appState.inputFilterText = $('#input-filter-text').val();
    }

    $(document).on("updateState", updateState);

    const addItemToOrder = (item) => {

        let foundItem;

        try {
            appState.carShopList.forEach((element, index) => {
                if (item.NUM_REG == element.NUM_REG) {
                    foundItem = index;
                    throw 'Break';
                }
            })
        } catch (e) {
            if (e !== 'Break') throw e
        }

        if (foundItem != undefined) {
            const aux = parseInt(appState.carShopList[foundItem].qty) + parseInt(item.qty);
            if (aux <= item.EXISTENCIA) {
                appState.carShopList[foundItem].qty = aux;
                $('#order-item-' + item.NUM_REG).html(aux);
                $.toast({
                    heading: 'Success',
                    text: 'El producto ' + item.APLICACION + ' - ' + item.DESCRIPCION + ' ha sido agregado a la orden',
                    showHideTransition: 'slide',
                    icon: 'success',
                    position: 'top-right',
                })
            } else {
                $.toast({
                    heading: 'Error',
                    text: 'La cantidad de productos solicitados supera la existencia disponible',
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                })
            }

        } else {

            if (item.qty <= item.EXISTENCIA) {
                appState.carShopList.push(JSON.parse(JSON.stringify(item)));
                $('#products-add-to-order').append(itemOnOrder(item));
                $('#total-item-on-order').html(appState.carShopList.length);

                $.toast({
                    heading: 'Success',
                    text: 'El producto ' + item.APLICACION + ' - ' + item.DESCRIPCION + ' ha sido agregado a la orden',
                    showHideTransition: 'slide',
                    icon: 'success',
                    position: 'top-right',
                });

                $('#btn-remove-item-order-' + item.NUM_REG).on('click', (e) => {
                    const idItemToRemove = e.target.id.split('-')[4];
                    removeItemOnOrder(idItemToRemove);
                });

            } else {
                $.toast({
                    heading: 'Error',
                    text: 'La cantidad de productos solicitados supera la existencia disponible',
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                })
            }

        }

    }

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

    const reloadProductList = (callback) => {
        $.event.trigger({ type: 'updateState' });

        filter = {
            brand: appState.brand,
            model: appState.model,
            year: appState.modelYears,
            inputFilterText: appState.inputFilterText
        };

        const filterValid = (filter.year && /^\d{4}$/.test(filter.year) && filter.brand != '' && filter.model != '') ? true : false;

        if (filterValid) {
            api.GET_FILTERED_PARTS_LIST(filter).then((res) => {

                $('#products-list')
                    .empty();

                res.forEach((item) => {
                    $('#products-list')
                        .append(itemOnProductsList(item));

                    $('#btn-add-item-' + item.NUM_REG).on('click', () => {
                        item.qty = parseInt($('#qty-' + item.NUM_REG).val());
                        addItemToOrder(item);
                    })
                });
                if (callback) {
                    callback();
                }

            });
            $('#form-message').empty();
        } else if (!(/^\d{4}$/.test(filter.year))) {
            spinner.stop();
            $('#products-list').empty();
            $('#form-message').html('<span>Formato de año incorrecto - YYYY</span>');

        } else {
            spinner.stop();
            $('#products-list').empty();
            $('#form-message').html('<span>Los siguientes datos son requeridos, año, marca y modelo</span>');
        }
    };

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
        const brandSelected = $(this).val();

        api.GET_MODELS(brandSelected).then((res) => {
            res.forEach(element => {
                $("#select-model").append('<option value="' + element.model + '">' + element.model + '</option>')
            });
            reloadProductList();
        });

    });

    $("#select-model").on("change", function () {
        reloadProductList();
    });

    $("#model-year").on("keyup blur change", function () {
        reloadProductList();
    });

    let timeout = null
    $("#input-filter-text").on("keyup blur change", function () {
        var text = this.value
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            reloadProductList();
        }, 500)
    });

    $("#select-idioma").on("change", function () {
        const langSelected = $(this).val();
        if (langSelected == "") {
            translator.lang("en"); //English use by default 
        } else {
            translator.lang($(this).val());
        }
    });

    const removeItemOnOrder = (idItemToRemove) => {
        let foundItem;
        try {
            appState.carShopList.forEach((element, index) => {
                if (idItemToRemove == element.NUM_REG) {
                    foundItem = index;
                    throw 'Break';
                }
            })
        } catch (e) {
            if (e !== 'Break') throw e
        }

        $.toast({
            heading: 'Warning',
            text: 'El producto ' + appState.carShopList[foundItem].APLICACION + ' - ' + appState.carShopList[foundItem].DESCRIPCION + ' ha eliminado de la orden',
            showHideTransition: 'slide',
            icon: 'warning',
            position: 'top-right',
        });

        appState.carShopList.splice(foundItem, 1);
        $('#container-order-item-' + idItemToRemove).remove();
        $('#total-item-on-order').html(appState.carShopList.length);

    };



    $("#contactForm").validate({
        // in 'rules' user have to specify all the constraints for respective fields
        rules: {
            firstname: "required",
            lastname: "required",
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            }
        },
        // in 'messages' user have to specify message as per rules
        messages: {
            firstname: "Please enter your firstname",
            lastname: "Please enter your lastname",
            email: "Please enter your email",
            phone: "Please enter your phone"
        }
    });

});