const fs = require("fs");
const mammoth = require("mammoth");

const parseDOCX = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const result = await mammoth.extractRawText({
    buffer
  });

  return result.value || "";
};

module.exports = parseDOCX;