const API_NODE = {
    GET_BRANDS: async () => {
        const aux = await $.ajax({
            method: "GET",
            url: constants.BASE_URL + constants.API_URLS.GET_APPLICATIONS_BRANDS
        });

        return aux;
    },
    GET_REGIONS: async () => {
        spinner.show();
        const aux = await $.ajax({
            method: "GET",
            url: constants.BASE_URL + constants.API_URLS.GET_REGIONS
        });
        spinner.stop()
        return aux;
    }
}

const API_PROCESSMAKER = {

}