const returnOrders = (data) => {
    const template =
        '<tr>' +
        '<td id="orderId">' + data.id + '</td>' +
        '<td id="orderDate">' + data.date + '</td>' +
        '<td id="orderQtyItem">' + data.qtyItems + '</td>' +
        '<td id="ordetTotal">' + data.total + '</td>' +
        '<td id="orderIsReturnable">' + data.isReturnable + '</td>' +
        '<td><button class="trn" data-trn-key="select_order_btn" id="btn-select-return-order-' + data.id + '">Select order</button></td>' +
        '</tr>'

    return template;
}