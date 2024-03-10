const puppeteer = require("puppeteer");
const fs = require("fs");

async function genCertificate(jsonData) {
  const htmlTemplate = fs.readFileSync(
    `./templates/${jsonData.template}.html`,
    "utf-8"
  );
  const htmlContent = htmlTemplate
    .replace("{{eventName}}", jsonData.eventName)
    .replace("{{dateOfIssuance}}", jsonData.dateOfIssuance)
    .replaceAll("{{recieverName}}", jsonData.recieverName)
    .replace("{{recipientID}}", jsonData.recipientID)
    .replace("{{organizationID}}", jsonData.organizationID)
    .replace("{{organizationName}}", jsonData.organizationName);

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "load" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return pdfBuffer;
}

module.exports = genCertificate;
