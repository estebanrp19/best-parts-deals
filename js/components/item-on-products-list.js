const itemOnProductsList = (data) => {

    let description = data.DESCRIPCION.substring(0, 55);

    if (description.length >= 55) {
        description = description + '...'
    }

    const template = ' <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 ">' +
        '<div class="card mt-3">' +
        '<div class="itemImageContent d-flex justify-content-center" id="itemImageContent-modal-' + data.CODIGO + '"><i class="image-expand fa fa-search-plus fa-2x" id="i-modal-' + data.CODIGO + '"></i>' +
        '<img class="card-img-top" src="' + BPD_IMAGES_URL + data.CODIGO + '.jpg" alt="' + description + '" id="img-modal-' + data.CODIGO + '"></div>' +
        '<div class="card-body">' +
        '<h5 class="card-tittle">' + description + '</h5>' +
        '<p class="card-subtitle text-muted">$' + data.PRECIO1 + '</p>' +
        '<h6 class="text-success"><span class="trn" data-trn-key="available_lbl">Available:</span> ' + data.EXISTENCIA + '</h6>' +
        '<h6 class="text-secondary"><span class="trn" data-trn-key="item_code_lbl">Code:</span> ' + data.CODIGO + '</h6>' +
        '<label class="quantity-text"><span class="trn" data-trn-key="quantity_lbl">Quantity:</span> </label><input class="quantity-input" type="number" value="1" min="1" max="' + data.EXISTENCIA + '" id="qty-' + data.NUM_REG + '"/>' +
        '<button class="trn btn btn-add-delete btn-outline-primary" id="btn-add-item-' + data.NUM_REG + '" data-trn-key="btn_add_item">Add</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}