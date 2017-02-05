var path = require('path');
var chunks = [];
var filePath = {
    srcPath: path.join(__dirname, '../src'),
    tplPath: path.join(__dirname, '../src'),
    build: path.join(__dirname, '../dist'),
    devbuild: path.join(__dirname, '../devbuild'),
    package: path.join(__dirname, '../package'),
    publicPath: '/'
};

var pages = [{
    name: 'Test/index',
    entry: 'Test/index.jsx',
    ftl: 'sijiPages/Test/index.html'
},{
    name: 'ViewDeliveryDetail/index',
    entry: 'ViewDeliveryDetail/index.jsx',
    ftl: 'sijiPages/ViewDeliveryDetail/index.html'
},{
    name: 'Protocol/index',
    entry: 'Protocol/index.jsx',
    ftl: 'sijiPages/Protocol/index.html'
},{
    name: 'ConfirmOrder/index',
    entry: 'ConfirmOrder/index.jsx',
    ftl: 'sijiPages/ConfirmOrder/index.html'
},{
    name: 'OrderDetail/index',
    entry: 'OrderDetail/index.jsx',
    ftl: 'sijiPages/OrderDetail/index.html'
},{
    name: 'OrderDetail2/index',
    entry: 'OrderDetail2/index.jsx',
    ftl: 'sijiPages/OrderDetail2/index.html'
},{
    name: 'OrderList/index',
    entry: 'OrderList/index.jsx',
    ftl: 'sijiPages/OrderList/index.html'
},{
    name: 'ItemDetail/index',
    entry: 'ItemDetail/index.jsx',
    ftl: 'sijiPages/ItemDetail/index.html'
},{
    name: 'GroupItemDetail/index',
    entry: 'GroupItemDetail/index.jsx',
    ftl: 'sijiPages/GroupItemDetail/index.html'
},{
    name: 'JoinGroup/index',
    entry: 'JoinGroup/index.jsx',
    ftl: 'sijiPages/JoinGroup/index.html'
},{
    name: 'GroupItemDetail/index',
    entry: 'GroupItemDetail/index.jsx',
    ftl: 'sijiPages/GroupItemDetail/index.html'
},{
    name: 'GroupSkuDetail/index',
    entry: 'GroupSkuDetail/index.jsx',
    ftl: 'sijiPages/GroupSkuDetail/index.html'
},{
    name: 'CalendarNav/index',
    entry: 'CalendarNav/index.jsx',
    ftl: 'sijiPages/CalendarNav/index.html'
},{
    name: 'CalendarPrdtDetail/index',
    entry: 'CalendarPrdtDetail/index.jsx',
    ftl: 'sijiPages/CalendarPrdtDetail/index.html'
},{
    name: 'MyProfile/index',
    entry: 'MyProfile/index.jsx',
    ftl: 'sijiPages/MyProfile/index.html'
},{
    name: 'DeliveryAddr/index',
    entry: 'DeliveryAddr/index.jsx',
    ftl: 'sijiPages/DeliveryAddr/index.html'
},{
    name: 'DeliveryAddrAdd/index',
    entry: 'DeliveryAddrAdd/index.jsx',
    ftl: 'sijiPages/DeliveryAddrAdd/index.html'
},{
    name: 'PayFail/index',
    entry: 'PayFail/index.jsx',
    ftl: 'sijiPages/PayFail/index.html'
},{
    name: 'PaySuccess/index',
    entry: 'PaySuccess/index.jsx',
    ftl: 'sijiPages/PaySuccess/index.html'
},{
    name: 'PrdtList/index',
    entry: 'PrdtList/index.jsx',
    ftl: 'sijiPages/PrdtList/index.html'
},{
    name: 'Cart/index',
    entry: 'Cart/index.jsx',
    ftl: 'sijiPages/Cart/index.html'
},{
    name: 'GroupStatus/index',
    entry: 'GroupStatus/index.jsx',
    ftl: 'sijiPages/GroupStatus/index.html'
},{
    name: 'PhoneBind/index',
    entry: 'PhoneBind/index.jsx',
    ftl: 'sijiPages/PhoneBind/index.html'
},{
    name: 'HomePage/index',
    entry: 'HomePage/index.jsx',
    ftl: 'sijiPages/HomePage/index.html'
},{
    name: 'GroupInvite/index',
    entry: 'GroupInvite/index.jsx',
    ftl: 'sijiPages/GroupInvite/index.html'
},{
    name: 'How2Play/index',
    entry: 'How2Play/index.jsx',
    ftl: 'sijiPages/How2Play/index.html'
},{
    name: 'SpringFestival/index',
    entry: 'SpringFestival/index.jsx',
    ftl: 'sijiPages/SpringFestival/index.html'
},{
    name: 'YQPrdtList/index',
    entry: 'YQPrdtList/index.jsx',
    ftl: 'sijiPages/YQPrdtList/index.html'
},{
    name: 'YQItemDetail/index',
    entry: 'YQItemDetail/index.jsx',
    ftl: 'sijiPages/YQItemDetail/index.html'
},{
    name: 'YQPresentStart/index',
    entry: 'YQPresentStart/index.jsx',
    ftl: 'sijiPages/YQPresentStart/index.html'
},{
    name: 'YQGiftStatus/index',
    entry: 'YQGiftStatus/index.jsx',
    ftl: 'sijiPages/YQGiftStatus/index.html'
},{
    name: 'YQDeliveryAddrAdd/index',
    entry: 'YQDeliveryAddrAdd/index.jsx',
    ftl: 'sijiPages/YQDeliveryAddrAdd/index.html'
},{
    name: 'YQDeliveryAddr/index',
    entry: 'YQDeliveryAddr/index.jsx',
    ftl: 'sijiPages/YQDeliveryAddr/index.html'
},{
    name: 'YQGiftBox/index',
    entry: 'YQGiftBox/index.jsx',
    ftl: 'sijiPages/YQGiftBox/index.html'
},{
    name: 'YQPrdtList/index',
    entry: 'YQPrdtList/index.jsx',
    ftl: 'sijiPages/YQPrdtList/index.html'
},{
    name: 'YQItemDetail/index',
    entry: 'YQItemDetail/index.jsx',
    ftl: 'sijiPages/YQItemDetail/index.html'
},{
    name: 'YQPresentStart/index',
    entry: 'YQPresentStart/index.jsx',
    ftl: 'sijiPages/YQPresentStart/index.html'
},{
    name: 'YQGiftStatus/index',
    entry: 'YQGiftStatus/index.jsx',
    ftl: 'sijiPages/YQGiftStatus/index.html'
},{
    name: 'YQGetSuccess/index',
    entry: 'YQGetSuccess/index.jsx',
    ftl: 'sijiPages/YQGetSuccess/index.html'
},{
    name: 'YQGift/index',
    entry: 'YQGift/index.jsx',
    ftl: 'sijiPages/YQGift/index.html'
},{
    name: 'YQGiftReceive/index',
    entry: 'YQGiftReceive/index.jsx',
    ftl: 'sijiPages/YQGiftReceive/index.html'
},{
    name: 'YQSetGift/index',
    entry: 'YQSetGift/index.jsx',
    ftl: 'sijiPages/YQSetGift/index.html'
},{
    name: 'YQShare/index',
    entry: 'YQShare/index.jsx',
    ftl: 'sijiPages/YQShare/index.html'
},{
    name: 'YQPaySuccess/index',
    entry: 'YQPaySuccess/index.jsx',
    ftl: 'sijiPages/YQPaySuccess/index.html'
},{
    name: 'YQOpenGift/index',
    entry: 'YQOpenGift/index.jsx',
    ftl: 'sijiPages/YQOpenGift/index.html'
}];

var pagesToPath = function() {
    var _p = [];
    pages.forEach(function(_page) {
        var _obj = {
            name: _page.name,
            entry: 'page/' + _page.entry,
            ftl: _page.ftl,
            templates: path.join(filePath.tplPath, _page.ftl)
        };
        _p.push(_obj);
        chunks.push(_page.name);
    });
    return _p;
};

module.exports = {
    filePath: filePath,
    pages: pages,
    pagesToPath: pagesToPath,
    port: 8090,
    chunks: chunks
};