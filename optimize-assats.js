var fs = require('fs');
var uglify = require("uglify-js");

let fileHead = `/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\ 
   | Combined & uglified javascript file                                        |
   |                                                                            |
   | Includes:                                                                  / \n`

const relative_dirs = (files) => {
    let tmp = files.map(file => {
        let path = 'public/javascripts/' + file;
        fileHead += `   | - `+path+'\n'
        return  fs.readFileSync(path, "utf8")
    })
    console.log(tmp)
    fileHead += `   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\ 
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
  */ \n\n`
    return tmp;
}
var options = { toplevel: false };

var uglified = uglify.minify(relative_dirs(['modernizr.js', 'general.js', 'translate.js', 'form-handling.js', 'minigame.js', 'minigame-notices.js']), options);

fs.writeFile('public/javascripts/all.js', fileHead+uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'public/javascripts/all.js');
  }      
});