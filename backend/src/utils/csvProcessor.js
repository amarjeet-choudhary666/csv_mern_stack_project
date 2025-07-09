import fs from "fs";
import csvParser from "csv-parser";

export const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        const { FirstName, Phone, Notes } = data;
        if (FirstName && Phone) {
          results.push({
            firstName: FirstName,
            phone: Phone,
            notes: Notes || "",
          });
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
