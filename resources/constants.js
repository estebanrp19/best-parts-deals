const constants = {
    BASE_URL: "http://localhost:3355",
    API_URLS: {
        "GET_GENERAL_CONFIG": '/general-config',
        "GET_APPLICATIONS_YEAR_RANGE": "/applications-year-range",
        "GET_APPLICATIONS_YEAR_START": "/applications-year-start",
        "GET_APPLICATIONS_YEAR_END": "/applications-year-end",
        "GET_APPLICATIONS_BRANDS": "/applications-brands",
        "GET_APPLICATIONS_MODELS": "/applications-models",
        "GET_PRODUCTS": "/products",
        "GET_REGIONS": "/regions",
        "GET_FILTERED_PARTS_LIST": "/filtered-parts-list",
        "GET_CAR_BRAND_LIST": "SELECT  DISTINCT (SPLIT_STR(paa.APLICACION,' ', 2)) brand from PMT_APLICACIONES_ACT paa inner join PMT_MARKETPLACES pm on paa.CODIGO = pm.CODIGO where pm.MARKETPLACE = '004' ORDER by brand ASC",
        "GET_CAR_MODELS_LIST": "SELECT  DISTINCT (SPLIT_STR(paa.APLICACION,' ', 3)) model from PMT_APLICACIONES_ACT paa inner join PMT_MARKETPLACES pm on paa.CODIGO = pm.CODIGO where pm.MARKETPLACE = '004' and SPLIT_STR(paa.APLICACION,' ', 2) = '@@0' ORDER by model ASC",
        "GET_APPLICATION_PART_LIST": "SELECT DISTINCT (paa.APLICACION), paa.YEAR_INI, paa.YEAR_FIN from PMT_APLICACIONES_ACT paa inner join PMT_MARKETPLACES pm on paa.CODIGO = pm.CODIGO where pm.MARKETPLACE = '004' ORDER by APLICACION ASC",
    },
    WORKFLOW_BASE_URL: "http://bpd.dyndns-web.com:8083",
    WORKFLOW_API_REST: {
        VALIDATE_EXISTENCE: "/pm/validate-existence",
        UPDATE_PRERESERVA: "/pm/update-pre-reserva",
        SAVE_CLIENT: "/pm/save-client",
        CREATE_ORDER_CASE: "/pm/create-case"
    },
    TASK_UID_DIRECT_SEARCH: "88981594356c9ef90b4bb48005562106",
    TASK_NAME_DIRECT_SEARCH: "direct_search",
    PRO_UID: "51619574156c9451f180a57008793936"
}