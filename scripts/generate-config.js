const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/config/encryption_keys.json');

const jsonContent = process.env.ENCRYPTION_KEYS_JSON;

if (!jsonContent)
{
	console.error("Error: ENCRYPTION_KEYS_JSON environment variable is missing.");
	process.exit(1);
}

fs.writeFileSync(targetPath, jsonContent);
console.log(`Successfully generated ${targetPath}`);