const itemImageView = (data) => {

    const template = '<div class="modal fade" id="itemImageViewModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered">' +
        '<div class="modal-content" id="item-image-view-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLabel">' + data.title + '</h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body" id="contentImage">' +
        '<img class="card-img-top" src="' + data.image + '" alt="">' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    return template;
}