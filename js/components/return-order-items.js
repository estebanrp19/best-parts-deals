const returnOrderItem = (data) => {
    const template =
        '<tr id="tr-return-item-' + data.orderId + '-' + data.itemCode + '">' +
        '<td id="description">' + data.description + '</td>' +
        '<td id="itemCode">' + data.itemCode + '</td>' +
        '<td id="orderId">' + data.orderId + '</td>' +
        '<td id="itemPrice">' + data.itemPrice + '</td>' +
        '<td id="qty">' + data.qty + '</td>' +
        '<td id="total">' + data.total + '</td>' +
        '<td><button id="btn-return-item-' + data.orderId + '-' + data.itemCode + '">Return item</button></td>' +
        '</tr>'

    return template;
}