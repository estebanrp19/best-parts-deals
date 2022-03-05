const itemOnOrder = (data) => {
    const template = '<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" id="container-order-item-' + data.NUM_REG + '">' +
        '<div class="card">' +
        '<div class="card-body">' +
        '<h5 class="card-tittle">' + data.APLICACION + ' - ' + data.DESCRIPCION + '</h5>' +
        '<p class="card-subtitle text-muted">$' + data.PRECIO1 + '</p>' +
        '<h6 class="text-secondary">Code: ' + data.CODIGO + '</h6>' +
        '<label>Quantity: <span id="order-item-' + data.NUM_REG + '">' + data.qty + '</span></label>' +
        '<button class="btn btn-outline-danger" id="btn-remove-item-order-' + data.NUM_REG + '">Delete</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}