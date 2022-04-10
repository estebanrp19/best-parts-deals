const smallReturnOrderItem = (data) => {
    const template =
        '<table id="small-tr-return-item-' + data.orderId + '-' + data.itemCode + '" class="table table-striped small-table-return">' +
        '<tbody>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="description_th">Description</td>' +
        '<td class="trn st-val ">' + data.description + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="code_th">Code</td>' +
        '<td class="trn st-val ">' + data.itemCode + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="order_th">Order</td>' +
        '<td class="trn st-val ">' + data.orderId + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="unit_price_th">Unit price</td>' +
        '<td class="trn st-val ">' + data.itemPrice + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="qty_th">Quantity</td>' +
        '<td class="trn st-val ">' + data.qty + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="total_th">Total</td>' +
        '<td class="trn st-val ">' + data.total + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="actions_th">Actions</td>' +
        '<td class="st-val "><button class="trn btn btn-add-delete btn-outline-primary"' +
        'data-trn-key="return_item_btn" id="btn-return-item-' + data.orderId + '-' + data.itemCode + '">Return item</button></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'

    return template;
}