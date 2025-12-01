class CadastroPage {
  constructor(driver, base = 'http://localhost:3000') {
    this.driver = driver;
    this.base = base;
    this.url = `${this.base}/cadastrar.html`;
  }

  async open() {
    await this.driver.get(this.url);
  }

  async fill(data) {
    const d = data;
    await this.driver.findElement({ name: 'massa' }).sendKeys(d.massa);
    await this.driver.findElement({ name: 'recheio' }).sendKeys(d.recheio);
    await this.driver.findElement({ name: 'cobertura' }).sendKeys(d.cobertura);
    await this.driver.findElement({ name: 'peso' }).sendKeys(String(d.peso));
    const decor = await this.driver.findElement({ name: 'decoracaoExtra' });
    const isChecked = await decor.isSelected();
    if (d.decoracaoExtra && !isChecked) await decor.click();
    if (!d.decoracaoExtra && isChecked) await decor.click();
    if (d.fotoDecoracao) await this.driver.findElement({ name: 'fotoDecoracao' }).sendKeys(d.fotoDecoracao);
  }

  async submit() {
    const btn = await this.driver.findElement({ css: 'button[type=submit]' });
    await btn.click();
  }
}

module.exports = CadastroPage;
