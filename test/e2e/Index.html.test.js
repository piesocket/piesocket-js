import '@babel/polyfill';
import puppeteer from "puppeteer";

describe("Index.html", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("Contains the welcome text", async () => {
    await page.goto("http://localhost:8080");
    await page.waitForSelector("h1");
    const text = await page.$eval("h1", (e) => e.textContent);
    expect(text).toContain("Welcome to PieSocket JS");
  });

  afterAll(() => browser.close());
});