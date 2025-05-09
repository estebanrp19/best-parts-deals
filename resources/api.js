const validateServerStatus = async () => {
    console.log('Validando el estado del servidor');

    const config = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_GENERAL_CONFIG
    });

    config.then((res) => {
        MAINTENANCE_STATUS = res.filter((item) => item.CATEGORIA == 'MAINTENANCE_STATUS')[0].VALOR;

        if (MAINTENANCE_STATUS != '0') {
            window.location.href = constants.MAINTENANCE_REDIRECTOR_URL;
        }
    }).catch((e) => {
        window.location.href = constants.MAINTENANCE_REDIRECTOR_URL;
    });
};

class Api {
    #GET_BRANDS = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_BRANDS
    });

    #GET_REGIONS = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_REGIONS
    });

    #GET_INIT_YEARS = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_START
    });

    #GET_END_YEARS = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_END
    });

    #GET_CONFIG_GENERAL = $.ajax({
        method: "GET",
        dataType: 'json',
        crossDomain: true,
        url: constants.BASE_URL + constants.API_URLS.GET_GENERAL_CONFIG

    });

    loadInitialData = async () => {
        validateServerStatus();
        return await $.when(this.#GET_REGIONS, this.#GET_BRANDS, this.#GET_INIT_YEARS, this.#GET_END_YEARS, this.#GET_CONFIG_GENERAL).then(function (r1, r2, r3, r4, r5) {
            const response = {
                regions: r1,
                brands: r2,
                initYears: [r3[0][0], r3[0][r3[0].length - 1]],
                endYears: [r4[0][0], r4[0][r4[0].length - 1]],
                configGeneral: r5
            }
            return response;
        }, function (jqXHR, textStatus, errorThrown) {
            var x1 = j1;
            var x2 = j2;
            if (x1.readyState != 4) {
                x1.abort();
            }
            if (x2.readyState != 4) {
                x2.abort();
            }
            console.log('Either j1 or j2 failed!');
        });

    }

    GET_MODELS = async (data) => {
        validateServerStatus();
        const models = await $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_MODELS
        });

        return models;
    }

    GET_APPLICATIONS_YEAR_START() {
        validateServerStatus();
        return $.ajax({
            method: "GET",
            dataType: 'json',
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_START
        });
    }

    GET_FILTERED_PARTS_LIST = async (filter) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data: filter,
            url: constants.BASE_URL + constants.API_URLS.GET_FILTERED_PARTS_LIST
        });
    }
}

class ApiProcessMaker {

    VALIDATE_EXISTENCE = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.WORKFLOW_API_REST.VALIDATE_EXISTENCE
        })
    };

    UPDATE_PRE_RESERVA = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.WORKFLOW_API_REST.UPDATE_PRERESERVA
        });
    };

    SAVE_CLIENT = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.WORKFLOW_API_REST.SAVE_CLIENT
        });
    };

    CREATE_CASE = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.WORKFLOW_API_REST.CREATE_ORDER_CASE
        });
    }

    PRE_RETURN = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.WORKFLOW_API_REST.PRE_RETURN
        })
    };

    GET_CAR_BRAND_LIST_BY_YEAR = async (data) => {
        validateServerStatus();
        return $.ajax({
            method: "POST",
            dataType: 'json',
            data,
            crossDomain: true,
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_BRANDS_BY_YEAR
        })
    }

}