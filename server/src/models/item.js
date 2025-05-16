// models/ft.js

class Item {
  constructor(name, symbol, image, description, attributes) {
    this.name = name;
    this.symbol = symbol;
    this.image = image;
    this.description = description;
    this.attributes = attributes || [];
  }
}

module.exports = Item;
