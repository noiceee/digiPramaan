const puppeteer = require("puppeteer");
const fs = require("fs");

function getTemplate(template) {
  switch (template) {
    case "PARTICIPATION":
      return "./templates/participate.html";
    case "WINNER":
      return "./templates/winner.html";
    case "RUNNERUP":
      return "./templates/runnerUp.html";
    default:
      break;
  }
}

async function genCertificate(jsonData) {
  try {
    const htmlTemplate = fs.readFileSync(
      getTemplate(jsonData.template),
      "utf-8"
    );
    const htmlContent = htmlTemplate
      .replace("{{orgLogo}}", jsonData.orgLogo)
      .replace("{{eventName}}", jsonData.eventName)
      .replace("{{dateOfIssuance}}", jsonData.dateOfIssuance)
      .replaceAll("{{recieverName}}", jsonData.recieverName)
      .replace("{{certificateId}}", jsonData.certificateId)
      .replace("{{organizationId}}", jsonData.organizationId)
      .replace("{{organizationName}}", jsonData.organizationName);

    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ height: 561, printBackground: true });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
}

module.exports = genCertificate;
