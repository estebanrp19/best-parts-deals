class Api {
    #GET_BRANDS = $.ajax({
        method: "GET",
        dataType: 'json',
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_BRANDS
    });

    #GET_REGIONS = $.ajax({
        method: "GET",
        dataType: 'json',
        url: constants.BASE_URL + constants.API_URLS.GET_REGIONS
    });

    #GET_INIT_YEARS = $.ajax({
        method: "GET",
        dataType: 'json',
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_START
    });

    #GET_END_YEARS = $.ajax({
        method: "GET",
        dataType: 'json',
        url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_END
    });

    #GET_CONFIG_GENERAL = $.ajax({
        method: "GET",
        dataType: 'json',
        url: constants.BASE_URL + constants.API_URLS.GET_GENERAL_CONFIG

    });

    loadInitialData = async () => {
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
            alert('Either j1 or j2 failed!');
        });

    }

    GET_MODELS = async (brand) => {
        const models = await $.ajax({
            method: "GET",
            dataType: 'json',
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_MODELS + "?brand=" + brand
        });

        return models;
    }

    GET_APPLICATIONS_YEAR_START() {
        return $.ajax({
            method: "GET",
            dataType: 'json',
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_YEAR_START
        });
    }

    GET_FILTERED_PARTS_LIST = async (filter) => {
        return $.ajax({
            method: "GET",
            dataType: 'json',
            url: constants.BASE_URL + constants.API_URLS.GET_FILTERED_PARTS_LIST + "?brand=" + filter.brand + '&model=' + filter.model + '&year=' + filter.year + '&inputFilterText=' + filter.inputFilterText
        });
    }



    API_PROCESSMAKER = {

    }
}


