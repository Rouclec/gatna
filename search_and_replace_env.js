/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const md5 = require("blueimp-md5");

fs.unlink(".env", (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(".env deleted successfully");
});

// Recursive function to get files
function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a .js file, push the full path to the files array
      if (file.split(".")[file.split(".").length - 1] === "js") {
        files.push(name);
      }
    }
  }
  return files;
}
let jsFiles = [];
// getFiles("testfiles", jsFiles);
getFiles(".next/", jsFiles);

fs.readFile(".env.example", "utf8", function (err, envData) {
  if (err) {
    return console.log(err);
  }
  let final = envData.split("\n").map((elem) => {
    let temp = elem.split("=");
    temp[1] = md5(temp[0]);
    return temp.join("=");
  });
  replaceDummyEnvironmentVariables(final);
  return final;
});

function replaceDummyEnvironmentVariables(envVar) {
  for (const file of jsFiles) {
    fs.readFile(file, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      let newData = data;
      for (const elem of envVar) {
        let tp = process.env[`${elem.split("=")[0]}`];
        newData = newData.replaceAll(md5(elem.split("=")[0]), tp);
      }
      fs.writeFile(file, newData, "utf8", function (err) {
        if (err) return console.log(err);
      });
    });
  }
}
