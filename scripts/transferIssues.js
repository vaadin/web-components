const fs = require('fs/promises');

async function main() {
  const packages = await fs.readdir('packages');
  packages.forEach((package) => {
    console.log(`Transferring issues for the package ${package}...`);
  });
}

main();
