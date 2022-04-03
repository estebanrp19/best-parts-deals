var configGeneral;
const appState = { carShopList: [], itemsReturned: [], itemsByOrder: [], itemsTotalOrdered: 0, totalAmountOrdered: 0 };
var BPD_IMAGES_URL;
$(document).ready(function () {

    const translator = $('body').translate({ lang: "en", t: dict }); //English use by default
    const api = new Api();
    const apiProcessMaker = new ApiProcessMaker();
    spinner.show();

    const updateState = (e) => {
        appState.brand = $('#select-brand').val();
        appState.model = $('#select-model').val();
        appState.modelYears = parseInt($('#model-year').val());
        appState.inputFilterText = $('#input-filter-text').val();
    }

    $('#select-region').val("USA-001");
    $('#select-idioma').val("en");

    $('#pagination-top').html(pagination());
    $('#pagination-botton').html(pagination());
    $(document).on("updateState", updateState);

    $("#select-region").change(() => {
        if ($('#select-region').val() == '') {
            $('#products-list').hide();
        } else {
            $('#products-list').show();
        }
    });

    const addAmountTotalAndQty = (product) => {
        let auxAmount = 0;
        let auxQty = 0;

        appState.carShopList.forEach((elem) => {
            auxAmount = Number(appState.totalAmountOrdered) + (Number(product.PRECIO1) * Number(product.qty));
            auxQty = Number(appState.itemsTotalOrdered) + Number(product.qty);
        })

        appState.itemsTotalOrdered = auxQty;
        appState.totalAmountOrdered = auxAmount;


        $('#itemTotalOrdered').html(appState.itemsTotalOrdered);
        $('#totalAmountOrdered').html(parseFloat(appState.totalAmountOrdered).toFixed(2));
    }

    const discountAmountTotalAndQty = (product) => {
        let auxAmount = 0;
        let auxQty = 0;

        appState.carShopList.forEach((elem) => {
            auxAmount = Number(appState.totalAmountOrdered) - (Number(product.PRECIO1) * Number(product.qty));
            auxQty = Number(appState.itemsTotalOrdered) - Number(product.qty);
        })

        appState.itemsTotalOrdered = auxQty;
        appState.totalAmountOrdered = auxAmount;


        $('#itemTotalOrdered').html(appState.itemsTotalOrdered);
        $('#totalAmountOrdered').html(parseFloat(appState.totalAmountOrdered).toFixed(2));
    }

    const addItemToOrder = (item) => {

        //debugger
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
                });

                //debugger
                addAmountTotalAndQty(item);
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

                //debugger
                addAmountTotalAndQty(item);

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

    const getBrandsbyYear = async (data) => {
        const brandsByYear = await apiProcessMaker.GET_CAR_BRAND_LIST_BY_YEAR(data).then((res) => res);
        return brandsByYear;
    }

    api.loadInitialData().then((res) => {

        configGeneral = res.configGeneral[0];
        BPD_IMAGES_URL = configGeneral.filter((item) => item.CATEGORIA == 'BPD_IMAGES_URL')[0].VALOR;

        res.regions[0].forEach(element => {
            $("#select-region").append('<option value="' + element.REGION_ID + '">' + element.REGION_NAME + '</option>')
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
            region: $('#select-region').val(),
            inputFilterText: appState.inputFilterText
        };

        const filterValid = (filter.year && /^\d{4}$/.test(filter.year) && filter.brand != '' && filter.model != '' && filter.region != '') ? true : false;

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
                    });


                });
                $('#input-filter-text').attr('disabled', false)
                spinner.stop();
                if (callback) {
                    callback();
                }

            });
            $('#form-message').empty();
        } else if (!(/^\d{4}$/.test(filter.year))) {
            spinner.stop();
            $('#products-list').empty();
            $('#form-message').html('<span>' + translate('invalid_format_year_message', appState.langSelected) + '</span>'); //Formato de año incorrecto - YYYY

        } else {
            spinner.stop();
            $('#products-list').empty();
            $('#form-message').html('<span>' + translate('required_fields_search_message', appState.langSelected) + '</span>');//Los siguientes datos son requeridos, año, marca y modelo
        }
    };

    $("#select-idioma").on("change", function () {
        const langSelected = $(this).val();
        if (langSelected == "") {
            translator.lang("en"); //English use by default 
        } else {
            translator.lang($(this).val());
        }

        appState.langSelected = langSelected;

        $('#email').attr('placeholder', translate('email_placeholder', langSelected));
        $('#emailReturn').attr('placeholder', translate('email_placeholder', langSelected));
        $('#firstname').attr('placeholder', translate('firstname_placeholder', langSelected));
        $('#lastname').attr('placeholder', translate('lastname_placeholder', langSelected));
        $('#phone').attr('placeholder', translate('telephone_placeholder', langSelected));

        $('#select-brand').attr('placeholder', translate('select_brand_placeholder', langSelected));
        $('#select-model').attr('placeholder', translate('select_model_placeholder', langSelected));
        $('#input-filter-text').attr('placeholder', translate('input_filter_text_placeholder', langSelected));
    });

    $("#select-brand").on("change", function () {
        spinner.show();
        $('#select-model').attr('disabled', true)
        $("#select-model").val('');
        $('#input-filter-text').attr('disabled', true)
        $('input-filter-text').val('');
        const brandSelected = $(this).val();

        const data = {
            year: $("#model-year").val(),
            region: $("#select-region").val(),
            brand: brandSelected
        }

        api.GET_MODELS(data).then((res) => {

            let modelsList = [];
            for (let i = 0; i <= res.length - 1; i++) {
                modelsList.push(res[i].model.toString())
            }
            $("#select-model").autocomplete({
                source: modelsList
            });

            $("#select-model").attr('disabled', false);


            reloadProductList();
        });

    });

    $("#select-model").on("change", function () {
        spinner.show();
        $('#input-filter-text').attr('disabled', true)
        $('input-filter-text').val('');
        reloadProductList();
    });

    $("#model-year").on("keyup blur change", function () {
        //reloadProductList();
    });

    $("#model-year").on("blur change", async function () {
        const data = {
            year: await $("#model-year").val(),
            region: await $("#select-region").val(),
        }

        $('#input-filter-text').attr('disabled', true)
        $('input-filter-text').val('');

        await $('#select-brand').autocomplete({
            source: []
        })
        $('#select-brand').attr('disabled', true)
        $('select-brand').val('');


        $('#select-model').attr('disabled', true)
        $('select-model').val('');

        $('#products-list').empty();

        if (data.region) {
            if (/\b\d{4}\b/g.test(data.year)) {
                getBrandsbyYear(data).then((res) => {
                    let brandsList = [];
                    for (let i = 0; i <= res.length - 1; i++) {
                        brandsList.push(res[i].brand.toString())
                    }
                    $("#select-brand").autocomplete({
                        source: brandsList
                    });

                    $('#select-brand').val('');
                    $("#select-brand").attr('disabled', false);
                    spinner.stop();
                });
            }
        } else {
            showToast('warning', translate('region-required-message'))
        }

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

        const item = appState.carShopList[foundItem];
        appState.carShopList.splice(foundItem, 1);
        $('#container-order-item-' + idItemToRemove).remove();
        $('#total-item-on-order').html(appState.carShopList.length);

        discountAmountTotalAndQty(item);

    };

    $.validator.methods.email = function (value, element) {
        return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
    }

    jQuery.validator.addMethod("lettersAndSpace", function (value, element) {
        return this.optional(element) || /^[a-zA-Z ]+$/.test(value);
    }, "Only lethers an space");

    $("#contactForm").validate({
        // in 'rules' user have to specify all the constraints for respective fields
        rules: {
            firstname: {
                required: true,
                lettersAndSpace: true
            },
            lastname: {
                required: true,
                lettersAndSpace: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                digits: true,
            }
        },
        // in 'messages' user have to specify message as per rules
        messages: {
            firstname: {
                required: "Please enter your firstname",
                lettersAndSpace: "Only letters and spaces"
            },
            lastname: {
                required: "Please enter your firstname",
                lettersAndSpace: "Only letters and spaces"
            },
            email: {
                required: "Please enter your email",
                email: "Email format invalid"
            },
            phone: {
                required: "Please enter your phone",
                digits: "Phone number invalid, Only numbers.",

            }
        }, submitHandler: () => {
            requestSaveClient();
        }
    });

    const requestEmailValidate = async (isReturn) => {
        const ubicador = isReturn ? 3 : 0;
        const data = {
            correo: isReturn ? $("#emailReturn").val() : $("#email").val(),
            region: $("#select-region").val(),
            ubicador: ubicador,
            lang: ($("#select-idioma").val() == "en") ? "en-001" : "sp-001"
        }

        const requestEmailValidate = await apiProcessMaker.SAVE_CLIENT(data).then((res) => res);
        return requestEmailValidate;
    };

    const requestSaveClient = async () => {
        const data = {
            correo: $("#email").val(),
            region: $("#select-region").val(),
            ubicador: 1,
            nmb: $("#firstname").val(),
            apell: $("#lastname").val(),
            tlf: $("#phone").val(),
            lang: ($("#select-idioma").val() == "en") ? "en-001" : "sp-001"
        }

        const resSaveClient = await apiProcessMaker.SAVE_CLIENT(data).then((res) => res);
        return resSaveClient;
    }

    const requestClientType = async () => {
        const data = {
            correo: $("#email").val(),
            region: $("#select-region").val(),
            ubicador: 2,
            nmb: $("#firstname").val(),
            apell: $("#lastname").val(),
            tlf: $("#phone").val(),
            lang: ($("#select-idioma").val() == "en") ? "en-001" : "sp-001"
        }

        const resSaveClient = await apiProcessMaker.SAVE_CLIENT(data).then((res) => res);
        return resSaveClient;
    }

    const validateExistence = async () => {
        const data = {
            correo: $("#email").val(),
            region: $("#select-region").val()
        }

        const arrDataRequest = [];

        appState.carShopList.forEach((item, index) => {
            let objGrille = [
                item.CODIGO,
                item.qty,
                index
            ]

            arrDataRequest.push(objGrille);
        });

        data.datos = arrDataRequest;
        const resValidateExistence = await apiProcessMaker.VALIDATE_EXISTENCE(data).then((res) => res);

        existenceIsValid = false;
        const itemInvalids = resValidateExistence[0].filter((item) => {
            const existencia = item[1];
            if (existencia == 0) {
                return item;
            }
        });


        if (appState.carShopList.length == 0) {
            $.toast({
                heading: 'Warning',
                text: 'La orden esta vacia',
                showHideTransition: 'slide',
                icon: 'warning',
                position: 'top-right',
            });
            return false;
        }

        if (itemInvalids.length > 0) {
            itemInvalids.forEach((item) => {
                $("#item-order-card-" + item[0]).css("background-color", "red");
                $.toast({
                    heading: 'Error',
                    text: 'La referencia ' + item[0] + ' no tiene suficiente exitencia disponible',
                    showHideTransition: 'slide',
                    icon: 'error',
                    position: 'top-right',
                });

                reloadProductList();
            });
            return false;

        } else {
            return true;
        }

    }

    const updatePreReserva = async () => {
        let app_number = "";
        let orderTotal = 0;
        const data = {
            correo: $("#email").val(),
            region: $("#select-region").val(),
        }

        const arrDataRequest = [];

        appState.carShopList.forEach((item, index) => {
            let objGrille = [
                item.CODIGO,
                item.qty,
                item.DESCRIPCION,
                item.PRECIO1,
                parseFloat(item.PRECIO1) * parseInt(item.qty),
                index
            ]

            orderTotal += parseFloat(item.PRECIO1) * parseInt(item.qty);

            arrDataRequest.push(objGrille);
        });

        data.datos = arrDataRequest;
        data.total_orden = orderTotal;
        data.nmb = $("#firstname").val();
        data.apell = $("#lastname").val();
        data.tlf = $("#phone").val();
        data.lang = ($("#select-idioma").val() == "en") ? "en-001" : "sp-001";


        await apiProcessMaker.UPDATE_PRE_RESERVA(data).then((res) => {
            app_number = res;
        })

        return app_number;
    }

    const requestPreReturn = async () => {
        const data = {
            correo: $("#emailReturn").val()
        };

        let resPreReturn = null;

        arrDataRequest = [];
        returnOrderTotal = 0;
        itemQtyTotal = 0;

        if (!appState.itemsReturned.length) {
            showToast('success', translate('preReturnEmpty', appState.userLang));
        } else {


            appState.itemsReturned.forEach((item, index) => {
                itemQtyTotal += parseInt(item.qty);

                let objGrille = [
                    item.itemCode,
                    item.itemPrice,
                    item.qty,
                    itemQtyTotal,
                    item.orderId,
                    item.description
                ]


                returnOrderTotal += parseFloat(item.itemPrice) * parseInt(item.qty);

                arrDataRequest.push(objGrille);
            });

            data.datos = arrDataRequest;
            data.total_price_ret = returnOrderTotal;
            data.total_qty_ret = itemQtyTotal;

            resPreReturn = await apiProcessMaker.PRE_RETURN(data).then((res) => res);
        }

        return resPreReturn;
    }

    const createOrderCase = (APP_NUMBER) => {
        const data = {
            tas_uid: constants.TASK_UID_DIRECT_SEARCH,
            variables: [{}]
        };

        data.variables[0].TASK_FROM = constants.TASK_NAME_DIRECT_SEARCH;
        data.variables[0].APP_NUMBER = APP_NUMBER;
        data.variables[0].REGION = $("#select-region").val();
        data.variables[0].LANG = ($("#select-idioma").val() == "en") ? "en-001" : "sp-001";
        data.variables[0].AP_CLI = $("#lastname").val();
        data.variables[0].MAIL_CLI = $("#email").val();
        data.variables[0].NMB_CLI = $("#firstname").val();
        data.variables[0].TEL_CLI = $("#phone").val();
        data.variables[0].TIPO_INICIO = 1;

        appState.carShopList = [];
        $('#products-add-to-order').empty();
        apiProcessMaker.CREATE_CASE(data);

    }

    const createReturnCase = (APP_NUMBER) => {
        const data = {
            tas_uid: constants.TASK_UID_DIRECT_SEARCH,
            variables: [{}]
        };

        data.variables[0].TASK_FROM = constants.TASK_NAME_RETURN;
        data.variables[0].CASE_OPTION = 4;
        data.variables[0].MAIL_CLI = $("#emailReturn").val();
        data.variables[0].NMB_CLI = $("#firstname").val();
        data.variables[0].AP_CLI = $("#lastname").val();
        data.variables[0].TEL_CLI = $("#phone").val();
        data.variables[0].INDEX = 2;
        data.variables[0].MATCH_ID = 1;
        data.variables[0].REGION = $("#select-region").val();
        data.variables[0].LANG = ($("#select-idioma").val() == "en") ? "en-001" : "sp-001";
        data.variables[0].LANG_CLI = (appState.userLang == "en") ? "en-001" : "sp-001";;

        if ($("#select-region").val() == "VEN-001") {
            data.variables[0].ORDER_NUMBER_SP = APP_NUMBER; //APP_NUMBER
        } else {
            data.variables[0].ORDER_NUMBER = APP_NUMBER; //APP_NUMBER
        }

        //appState.carShopList = [];
        //$('#products-add-to-order').empty();
        const response = apiProcessMaker.CREATE_CASE(data);
        return response;

    }
    const requestGetOrder = async (data) => {
        const params = {
            correo: $("#emailReturn").val(),
            ubicador: 6,
            order_row: data.id
        }

        const resGetOrder = await apiProcessMaker.SAVE_CLIENT(params).then((res) => res);
        return resGetOrder;
    };

    const selectReturnOrder = async (data) => {
        const resGetOrder = await requestGetOrder(data);
        appState.itemsByOrder = [];
        $('#return-order-items').empty().append(
            '<tr> <th class="trn" scope="col" data-trn-key="description_th">' + translate('description_th', appState.langSelected) +
            '</th> <th class="trn" scope="col" data-trn-key="code_th">' + translate('code_th', appState.langSelected) + '</th>' +
            '<th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) +
            '</th> <th class="trn" scope="col" data-trn-key="unit_price_th">' + translate('unit_price_th', appState.langSelected) + '</th>' +
            '<th class="trn" scope="col" data-trn-key="qty_th">' + translate('qty_th', appState.langSelected) +
            '</th> <th class="trn" scope="col" data-trn-key="total_th">' + translate('total_th', appState.langSelected) + '</th>' +
            '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>'
        );

        appState.returnOrderSelected = data;

        resGetOrder.forEach((item) => {
            const params = {
                description: item[1],
                itemCode: item[0],
                orderId: data.id,
                itemPrice: item[2],
                qty: item[4],
                total: item[3],
            }

            const itemFound = appState.itemsReturned.filter((element) => (element.orderId == params.orderId && element.itemCode == params.itemCode));

            if (!itemFound.length) {
                appState.itemsByOrder.push(params);
            }

        });

        $('#order-selected').text(data.id)

        appState.itemsByOrder.forEach((item) => {
            $('#return-order-items').append(returnOrderItem(item));
            $('#btn-return-item-' + item.orderId + '-' + item.itemCode).click(() => {
                selectReturnItem(item);
                $('#tr-return-item-' + item.orderId + '-' + item.itemCode).remove()
            });
            $('#btn-return-item-' + item.orderId + '-' + item.itemCode).text(translate('return_item_btn', $("#select-idioma").val()))
        })

    }

    const selectReturnItem = (data) => {

        appState.itemsReturned.push(data);
        $('#items-returned-list').append(itemsReturnedList(data));
        $('#btn-remove-item-returned-' + data.orderId + '-' + data.itemCode).text(translate('cancel_return_btn', $("#select-idioma").val()));
        $('#btn-remove-item-returned-' + data.orderId + '-' + data.itemCode).click(() => {
            const itemFound = appState.itemsReturned.findIndex((element) => (element.orderId == data.orderId && element.itemCode == data.itemCode));
            appState.itemsReturned.splice(itemFound, 1);
            $('#tr-remove-item-returned-' + data.orderId + '-' + data.itemCode).remove();
            selectReturnOrder(appState.returnOrderSelected);
        });

    }

    $("#sendCase").click(async (e) => {
        const confirmar = translate('confirm', appState.userLang);
        const cancelar = translate('cancel', appState.userLang);

        $.confirm({
            title: translate('confirmOderTitle', appState.userLang),
            content: translate('preOrderAgree', appState.userLang),
            buttons: {
                confirmar: {
                    text: confirmar,
                    action: async () => {
                        const clientType = await requestClientType();
                        if ($("#contactForm").valid()) {
                            if (clientType[2] == 1) {
                                const validated = await validateExistence().then((res) => res); // con la respuesta de este servicio controlamos si la existencia es valida y pasamos al siguiente
                                if (validated) {
                                    updatePreReserva().then((res) => {
                                        createOrderCase(res);
                                    }) // actualizamos y generamnos APP_NUMBER .. siguiente generar caso nuevo 
                                } else {
                                    showToast("warning", translate('insuficientExistence', appState.userLang))
                                }
                            } else {
                                showToast("warning", translate('mustConfirEmail', appState.userLang))
                            }
                        } else {
                            showToast("warning", translate('invalidForm', appState.userLang))
                        }
                    }

                },
                cancelar: { text: cancelar },
            }
        });
    });

    $("#sendReturn").click(async (e) => {
        const confirmar = translate('confirm', appState.userLang);
        const cancelar = translate('cancel', appState.userLang);

        $.confirm({
            title: translate('confirmReturnTitle', appState.userLang),
            content: translate('preReturnAgree', appState.userLang),
            buttons: {
                confirmar: {
                    text: confirmar,
                    action: async () => {
                        const resPreReturn = await requestPreReturn().then((res) => res);
                        if (resPreReturn) {
                            createReturnCase().then((res) => {
                                showToast('success', translate('preReturnSuccess', appState.userLang));
                                clearReturnTables('all');
                            });
                            //showToast('success', translate('preReturnSuccess', appState.userLang));
                        }
                    }

                },
                cancelar: { text: cancelar },
            }
        });

    });

    const clearReturnTables = (table) => {
        switch (table) {
            case 'all':
                $('#return-orders-list').empty();
                $('#return-orders-list').append('<tr> <th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="date_th">' + translate('date_th', appState.langSelected) + '</th> <th class="trn" scope="col" data-trn-key="number_item_th">'
                    + translate('number_item_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="order_total_th">' + translate('order_total_th', appState.langSelected) + '</th> <th class="trn" scope="col" data-trn-key="is_returnable_th">'
                    + translate('is_returnable_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>');

                $('#return-order-items').empty();
                $('#return-order-items').empty().append(
                    '<tr> <th class="trn" scope="col" data-trn-key="description_th">' + translate('description_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="code_th">' + translate('code_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="unit_price_th">' + translate('unit_price_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="qty_th">' + translate('qty_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="total_th">' + translate('total_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>'
                );

                $('#items-returned-list').empty();
                $('#items-returned-list').empty().append(
                    '<tr> <th class="trn" scope="col" data-trn-key="description_th">' + translate('description_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="code_th">' + translate('code_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="unit_price_th">' + translate('unit_price_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="qty_th">' + translate('qty_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="total_th">' + translate('total_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>'
                );
                break;
            case 'return-orders-list':
                $('#return-orders-list').empty();
                $('#return-orders-list').append('<tr> <th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="date_th">' + translate('date_th', appState.langSelected) + '</th> <th class="trn" scope="col" data-trn-key="number_item_th">'
                    + translate('number_item_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="order_total_th">' + translate('order_total_th', appState.langSelected) + '</th> <th class="trn" scope="col" data-trn-key="is_returnable_th">'
                    + translate('is_returnable_th', appState.langSelected) + '</th> ' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>');

                break;

            case 'return-order-items':
                $('#return-order-items').empty();
                $('#return-order-items').empty().append(
                    '<tr> <th class="trn" scope="col" data-trn-key="description_th">' + translate('description_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="code_th">' + translate('code_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="unit_price_th">' + translate('unit_price_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="qty_th">' + translate('qty_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="total_th">' + translate('total_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>'
                );
                break;

            case 'items-returned-list':
                $('#items-returned-list').empty();
                $('#items-returned-list').empty().append(
                    '<tr> <th class="trn" scope="col" data-trn-key="description_th">' + translate('description_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="code_th">' + translate('code_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="order_th">' + translate('order_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="unit_price_th">' + translate('unit_price_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="qty_th">' + translate('qty_th', appState.langSelected) +
                    '</th> <th class="trn" scope="col" data-trn-key="total_th">' + translate('total_th', appState.langSelected) + '</th>' +
                    '<th class="trn" scope="col" data-trn-key="actions_th">' + translate('actions_th', appState.langSelected) + '</th> </tr>'
                );
                break;
        }
    }

    const emailChange = async (isReturn) => {
        const emailText = await $('#email').val();
        const emailReturnText = await $('#emailReturn').val();

        $('#email').val(emailText);
        $('#emailReturn').val(emailReturnText);

        const res = await requestEmailValidate(isReturn).then(res => res);
        const clientName = res[1];
        const clientLastname = res[2];
        const clientPhone = res[3];
        const clientLang = res[4] == null ? $('#select-idioma').val() : 'sp-001' ? 'es' : 'en';
        const orderList = res[7];
        $('#order-selected').text('');

        appState.userLang = clientLang;

        if (!isReturn) {
            switch (res[0]) {
                case 0:
                    showToast("warning", translate('Ubi0Res0', appState.userLang));
                    $("#sendCase").attr('disabled', true);
                    break;
                case 1:
                    showToast("warning", translate('Ubi0Res1', appState.userLang, [clientName, clientLastname]));
                    $("#sendCase").attr('disabled', false);
                    break;
                case 2:
                    showToast("warning", translate('Ubi0Res2', appState.userLang, [clientName, clientLastname]));
                    $("#sendCase").attr('disabled', false);
                    break;
                case 3:
                    showToast("warning", translate('Ubi0Res3', appState.userLang));
                    $("#sendCase").attr('disabled', true);
                    break;
                case 4:
                    showToast("warning", translate('Ubi0Res4', appState.userLang));
                    $("#sendCase").attr('disabled', true);
                    break;
            }
        } else {
            switch (res[0]) {
                case 1:
                    showToast("success", translate('OrdersLoaded', appState.userLang));

                    clearReturnTables('return-orders-list');

                    orderList.forEach((element, index) => {
                        const data = {};
                        data.id = element[0];
                        data.date = element[1];
                        data.total = element[2];
                        data.qtyItems = element[3];
                        data.isReturnable = element[4] ? 'Si' : 'No';

                        $('#return-orders-list')
                            .append(returnOrders(data, data.isReturnable));

                        if (!element[4]) {
                            $('#btn-select-return-order-' + data.id).attr('disabled', true)
                        }

                        $('#btn-select-return-order-' + data.id).click(() => {
                            selectReturnOrder(data);
                        });

                        $('#btn-select-return-order-' + data.id).text(translate('select_order_btn', $("#select-idioma").val()))
                    })
                    break;
            }
        }

        $("#firstname").val(clientName).blur();
        $("#lastname").val(clientLastname).blur();
        $("#phone").val(clientPhone).blur();

    }

    $("#email").change((e) => {
        emailChange();
    });

    $("#emailReturn").change((e) => {
        emailChange(true);
    });

    $("#select-region").change(() => {
        $("#model-year").val('');
        $("#select-brand").attr('disabled', true);
        $("#select-model").attr('disabled', true);

        $("#select-brand").autocomplete({
            source: []
        });

        $("#select-model").autocomplete({
            source: []
        });

        $("#select-brand").val('');
        $("#select-model").val('');

        $('#products-list').empty();
    })



    const requestReturnItems = async () => {
        //const reStReturnItems = await apiProcessMaker.RETURN_ITEMS({ test: 'test' }).then((res) => res);
        //return reStReturnItems;
    }

    $('#imageShppingCart').click(() => {
        document.getElementById("products-add-to-order").scrollIntoView();
    })

    //requestReturnItems()

});