const chrome = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

export default async function getTitle(req: any, res: any) {
  const isProd = process.env.NODE_ENV === "production";

  let browser;

  if (isProd) {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
    });
  } else {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
  }

  console.log("huynvq::========>isProd", isProd);

  const page = await browser.newPage();

  await page.setViewport({ width: 600, height: 600 });

  await page.goto("https://www.google.com");

  console.log("huynvq::========>isProd", await page.title());
  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  // CORS
  // res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.statusCode = 200;
  res.send(await page.title());

  await browser.close();
}
