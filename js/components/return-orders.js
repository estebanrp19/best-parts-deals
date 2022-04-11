const returnOrders = (data) => {
    const template =
        '<tr>' +
        '<td></td>' +
        '<td id="orderId">' + data.id + '</td>' +
        '<td id="orderDate">' + data.date + '</td>' +
        '<td id="orderQtyItem">' + data.qtyItems + '</td>' +
        '<td id="ordetTotal">' + data.total + '</td>' +
        '<td id="tr-returnable-' + data.id + '">' + data.isReturnable + '</td>' +
        '<td><button class="trn btn btn-add-delete btn-outline-primary" data-trn-key="select_order_btn" id="btn-select-return-order-' + data.id + '">Select order</button></td>' +
        '</tr>'

    return template;
}