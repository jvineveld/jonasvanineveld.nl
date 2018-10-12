const fs = require('fs');
const uglify = require("uglify-js");
const brotli = require('brotli');

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


const create_brotli_crompressed_files = (brotli_files) => {
    brotli_files.forEach(file => {
        fs.writeFile(file+'.br', brotli.compress(fs.readFileSync(file)), function(err){ 
            if (!err) { 
                console.log('Brotli crompressed file:', file)
            }
        });
    })
}

create_brotli_crompressed_files([
    'public/images/avatar.jpg',
    'public/images/star-hover.svg',
    'public/images/star-full.svg',
    'public/images/star.svg',
    'public/images/gamepad.svg',
    'public/images/keyboard.svg',
    'public/styles/css/index.css',
]);