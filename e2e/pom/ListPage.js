class ListPage {
  constructor(driver, base = 'http://localhost:3000') {
    this.driver = driver;
    this.base = base;
    this.url = `${this.base}/listar.html`;
  }

  async open() {
    await this.driver.get(this.url);
  }

  async getItems() {
    // Wait for list container
    const container = await this.driver.findElement({ id: 'lista' });
    const lis = await container.findElements({ css: 'li' });
    const out = [];
    for (const li of lis) {
      const text = await li.getText();
      out.push(text);
    }
    return out;
  }
}

module.exports = ListPage;
