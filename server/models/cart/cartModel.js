export default class Cart {
  constructor(oldCart = {}) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }

  add = function (item, id) {
    var storedItem = this.items[id];

    // in case an item has not yet been added to the cart
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }

    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  reduceByOne = function (id) {
    if (!this.items[id]) {
      throw new Error("Product was not found in cart");
    }
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
  toSessionObject = function () {
    let {items, totalQty, totalPrice} = this;
    return {
      items,
      totalQty,
      totalPrice
    }
  };
  generateArray = function () {
    var arr = [];

    for (var id in this.items) {
      arr.push(this.items[id].item);
    }

    return arr;
  };

  serialize = function () {
    let params = {};
    params.products = this.generateArray();
    params["total_sum"] = this.totalPrice;
    params["products_count"] = this.totalQty;
    return params;
  };
}
