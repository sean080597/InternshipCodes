const xlsx = require("xlsx");

//=== export xlsx to json ===
// const fileInput = "part1.xlsx"
// const fileOutput = "finalOutput.json"
// const sheetName = "Sheet1"
// var wb = xlsx.readFile("input/" + fileInput, {cellDates:true});
// var ws = wb.Sheets[sheetName];
// var data = xlsx.utils.sheet_to_json(ws, {defval:""});

// const fs = require('file-system');
// const jsonString = JSON.stringify(data);
// fs.writeFile("output/" + fileOutput, jsonString, 'utf-8', (err, data) => {
//     if(err) throw err;
//     console.log('Saved to file');
// })
// console.log(data);

//=== export json to excel ===
const fileInput = "input/" + "test_json.json"
const fileOutput = "output/" + "ConvertedExcel.xlsx"
const fs = require('fs');
var data = fs.readFileSync(fileInput, 'utf8');
data = JSON.stringify(data);
// console.log(data);
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(data);
console.log(newWS)
// xlsx.utils.book_append_sheet(newWB, newWS, "New Data");

// xlsx.writeFile(newWB, fileOutput);