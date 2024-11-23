/* eslint-disable @typescript-eslint/no-require-imports */
let fs = require("fs");
const md5 = require("blueimp-md5");
fs.readFile("/app/.env.example", "utf8", function (err, data) {
  fs.writeFile("/app/.env", data, "utf8", function (err) {
    if (err) return console.log(err);
  });
  if (err) {
    return console.log(err);
  }
  let final = data.split("\n").map((elem) => {
    let temp = elem.split("=");
    temp[1] = md5(temp[0]);
    return temp.join("=");
  });
  fs.writeFile("/app/.env", final.join("\n"), "utf8", function (err) {
    if (err) return console.log(err);
  });
});
