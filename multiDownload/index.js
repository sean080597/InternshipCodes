var fs = require("fs");
var request = require("request");

const destPath = "downloaded/";
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath);
}

const fileInput = "links.json";
var data = fs.readFileSync(fileInput, "utf8");
var urlList = JSON.parse(data);

// var urlList = [
//   "http://cdn.mos.musicradar.com/audio/samples/musicradar-western-guitar-samples.zip",
//   "http://cdn.mos.musicradar.com/audio/samples/musicradar-wavedrum-samples.zip",
// ];

var download = function (url, dest, callback) {
  request
    .get(url)
    .on("error", function (err) {
      console.log(err);
    })
    .pipe(fs.createWriteStream(dest))
    .on("close", callback);
};

urlList.forEach(function (str) {
  var filename = str.split("/").pop();
  console.log("Downloading " + filename);
  download(str, destPath + filename, function () {
    console.log("Finished Downloading: " + filename);
  });
});
