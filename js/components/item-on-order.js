const itemOnOrder = (data) => {

    let description = data.DESCRIPCION.substring(0, 40);

    if (description.length >= 40) {
        description = description + '...'
    }

    const template = '<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" id="container-order-item-' + data.NUM_REG + '">' +
        '<div class="box-items-order" id="item-order-card-' + data.CODIGO + '">' +
        '<div class="card-body">' +
        '<h5 class="card-tittle">' + description + '</h5>' +
        '<p class="card-subtitle text-muted">$' + data.PRECIO1 + '</p>' +
        '<h6 class="text-secondary"><span class="trn" data-trn-key="item_code_lbl">Code:</span> ' + data.CODIGO + '</h6>' +
        '<label><span class="trn" data-trn-key="quantity_lbl">Quantity:</span> <span id="order-item-' + data.NUM_REG + '">' + data.qty + '</span></label>' +
        '<button class="trn btn btn-outline-danger btn-add-delete" id="btn-remove-item-order-' + data.NUM_REG + '" data-trn-key="btn_delete_item">Delete</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}