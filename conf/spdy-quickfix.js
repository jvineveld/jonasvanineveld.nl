/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | A quickfix for a ERR_ASSERTION error you get in result of using the spdy http2  |
   | module with express Will patch spdy every time npm install is used.             |
   |                                                                                 |
   | https://github.com/spdy-http2/spdy-transport/issues/47#issuecomment-369020176   |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author misterfresh - Github                                                    |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */

let fs = require('fs')
let path = require('path')
let file = path.join(
    process.cwd(),
    'node_modules/spdy-transport/lib/spdy-transport/priority.js'
)

let data = fs
    .readFileSync(file)
    .toString()
    .split('\n')
if (data.length < 190) {
    data.splice(73, 0, '/*')
    data.splice(75, 0, '*/')
    data.splice(
        187,
        0,
        `
	var index = utils.binarySearch(this.list, node, compareChildren);
 	this.list.splice(index, 1);
`
    )
    let text = data.join('\n')

    fs.writeFile(file, text, function(err) {
        if (err) return console.log(err)
    })
}