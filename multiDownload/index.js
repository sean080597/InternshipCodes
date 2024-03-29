var fs = require("fs");
var request = require("request");

const destPath = "downloaded";
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

// var urlList = [
//   {
// 		"name": "ngay-trai-tim-roi-le-lofi",
// 		"url": "https://dt.muvi.vn/mvn/track/song/2022/10/24/ngaytraitimroilelofimaster_20221024113722.mp3"
// 	},
// 	{
// 		"name": "khong-tan-lofi-teed",
// 		"url": "https://dt.muvi.vn/mvn/track/song/2022/10/17/0-tandickson-nguyen-lofinam-viet_20221017105135.mp3"
// 	},
//   {
//     "name": "Cuu-Van-Kip-Khong-Lofi-Version-Vuong-Anh-Tu",
//     "url": "https://vnso-zn-15-tf-mp3-320s1-m-zmp3.zmdcdn.me/1a4aeb59e2190b475208/2341647976148343873?authen=exp=1669361389~acl=/1a4aeb59e2190b475208/*~hmac=19898307c027afad9b723eb72e7521de"
//   }
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

urlList.forEach(function (el) {
  let filename = "";
  let url = "";
  if (typeof el === "string") {
    filename = el.split("/").pop();
    url = el;
  } else if (el.hasOwnProperty("name") && el.hasOwnProperty("url")) {
    filename = el.name + ".mp3";
    url = el.url;
  }

  console.log("Downloading " + filename);
  download(url, destPath + "/" + filename, function () {
    console.log("Finished Downloading: " + filename);
  });
});
