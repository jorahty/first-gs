class Set {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  add(item) {
    if (!this.items.includes(item)) {
      this.items.push(item);
      this.#render();
    }
  }

  remove(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.#render();
    }
  }

  #render() {
    console.log(`[${this.items.map(() => '•').join('')}]`);
  }
}

module.exports = Set;
