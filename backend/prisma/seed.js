// prisma/seed.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // ✅ simple again

async function main() {
  const data = [
    {
      code: "TT",
      name: "Trinidad and Tobago",
      immigrationUrl: "https://www.immigration.gov.tt/",
      competentAuthorityUrl: "https://tradeind.gov.tt/",
      formsUrl: "https://www.ttbizlink.gov.tt/",
      notes:
        "Check the Ministry of Labour / Trade and Industry websites for Skills Certificate and CSME information.",
    },
    {
      code: "BB",
      name: "Barbados",
      immigrationUrl: "https://immigration.gov.bb/",
      competentAuthorityUrl:
        "https://caricom.org/caricom-single-market-and-economy-csme/",
      formsUrl: "https://www.gov.bb/Online-Services",
      notes:
        "Barbados usually processes Skills Certificates through designated government offices. Confirm latest forms and fees.",
    },
    {
      code: "JM",
      name: "Jamaica",
      immigrationUrl: "https://www.pica.gov.jm/",
      competentAuthorityUrl: "https://www.mlss.gov.jm/",
      formsUrl: "https://www.mlss.gov.jm/departments/work-permit/",
      notes:
        "Check the Ministry of Labour & Social Security and relevant immigration pages.",
    },
  ];

  for (const c of data) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  console.log("Seeded countries.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
