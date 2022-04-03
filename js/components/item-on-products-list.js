const itemOnProductsList = (data) => {

    let description = data.DESCRIPCION.substring(0, 55);

    if (description.length >= 55) {
        description = description + '...'
    }

    const template = ' <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 ">' +
        '<div class="card">' +
        '<img class="card-img-top" src="' + BPD_IMAGES_URL + data.CODIGO + '.jpg" alt="">' +
        '<div class="card-body">' +
        '<h5 class="card-tittle">' + description + '</h5>' +
        '<p class="card-subtitle text-muted">$' + data.PRECIO1 + '</p>' +
        '<h6 class="text-success">Available: ' + data.EXISTENCIA + '</h6>' +
        '<h6 class="text-secondary">Code: ' + data.CODIGO + '</h6>' +
        '<label class="quantity-text">Quantity:</label><input class="quantity-input" type="number" value="1" min="1" max="' + data.EXISTENCIA + '" id="qty-' + data.NUM_REG + '"/>' +
        '<button class="btn btn-add-delete btn-outline-primary" id="btn-add-item-' + data.NUM_REG + '">Add</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}