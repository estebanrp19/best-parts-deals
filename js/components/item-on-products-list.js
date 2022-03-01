const itemOnProductsList = (data) => {
    const template = ' <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-none d-sm-none d-md-block">' +
        '<div class="card">' +
        '<img class="card-img-top" src="' + BPD_IMAGES_URL + data.CODIGO + '.jpg" alt="">' +
        '<div class="card-body">' +
        '<h5 class="card-tittle">' + data.APLICACION + ' ' + data.DESCRIPCION + '</h5>' +
        '<p class="card-subtitle text-muted">$' + data.PRECIO1 + '</p>' +
        '<h6 class="text-success">Available: 2</h6>' +
        '<h6 class="text-secondary">Code: ' + data.CODIGO + '</h6>' +
        '<a href="#" class="btn btn-outline-primary">Add</a>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}