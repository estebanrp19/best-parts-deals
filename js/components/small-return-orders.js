const smallReturnOrders = (data) => {
    const template =
        '<table class="table table-striped small-table-return">' +
        '<tbody>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="order_th">Order</td>' +
        '<td class="trn st-val ">' + data.id + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="date_th">Date</td>' +
        '<td class="trn st-val ">' + data.date + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="number_item_th">Number of items</td>' +
        '<td class="trn st-val ">' + data.qtyItems + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="order_total_th">Order total</td>' +
        '<td class="trn st-val ">' + data.total + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="is_returnable_th">Is returnable?</td>' +
        '<td id="tr-small-returnable-' + data.id + '" class="trn st-val">' + data.isReturnable + '</td>' +
        '</tr>' +
        '<tr class="">' +
        '<td class="trn st-key" data-trn-key="actions_th">Actions</td>' +
        '<td class="st-val "><button class="trn btn btn-add-delete btn-outline-primary"' +
        'data-trn-key="select_order_btn" id="btn-select-return-order-' + data.id + '">Select order</button></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'

    return template;
}