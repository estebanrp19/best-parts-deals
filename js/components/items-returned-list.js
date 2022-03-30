const itemsReturnedList = (data) => {
    const template =
        '<tr id="tr-remove-item-returned-' + data.orderId + '-' + data.itemCode + '">' +
        '<td id="description">' + data.description + '</td>' +
        '<td id="itemCode">' + data.itemCode + '</td>' +
        '<td id="orderId">' + data.orderId + '</td>' +
        '<td id="itemPrice">' + data.itemPrice + '</td>' +
        '<td id="qty">' + data.qty + '</td>' +
        '<td id="total">' + data.total + '</td>' +
        '<td><button class="trn" data-trn-key="cancel_return_btn" id="btn-remove-item-returned-' + data.orderId + '-' + data.itemCode + '">Cancel return</button></td>' +
        '</tr>'

    return template;
}