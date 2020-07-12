const fs = require('fs') // core node module
const http = require('http')
const url = require('url')

const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8')
const laptopData = JSON.parse(json) // json -> obj

const server = http.createServer((req,res) => {

    const pathName = url.parse(req.url,true).pathname

    console.log(pathName)
    const id = url.parse(req.url,true).query.id

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type':'text/html'}) 

        fs.readFile(`${__dirname}/data/templates/overview.html`,'utf-8', (err, data) => {
            let overviewOutput = data
            fs.readFile(`${__dirname}/data/templates/card.html`,'utf-8', (err, data) => {
                const cardOutput = laptopData.map( el => replaceTemplate(data,el)).join('')
                overviewOutput = overviewOutput.replace('{%CARDS%}',cardOutput)
                res.end(overviewOutput)
            }) 
        }) 
    } 

    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type':'text/html'}) 
        fs.readFile(`${__dirname}/data/templates/laptop.html`,'utf-8', (err, datas) => {
        const laptop = laptopData[id]
        let output = replaceTemplate(datas,laptop)
        res.end(output)
        }) 
    }

    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`,(err,data) => {
            res.writeHead(200, {'Content-type':'image/jpg'})
            res.end(data)
        })
    }

    else {
        res.writeHead(200, {'Content-type':'text/html'}) 
        res.end('URL not found')
    }

})

server.listen(1337,'127.0.0.1',() => {
    console.log("Listening for request now")
})

function replaceTemplate(html,data) {
    let output = html.replace(/{%PRODUCTNAME%}/g,data.productName)
    output = output.replace(/{%IMAGE%}/g,data.image)
    output = output.replace(/{%PRICE%}/g,data.price)
    output = output.replace(/{%SCREEN%}/g,data.screen)
    output = output.replace(/{%CPU%}/g,data.cpu)
    output = output.replace(/{%STORAGE%}/g,data.storage)
    output = output.replace(/{%RAM%}/g,data.ram)
    output = output.replace(/{%DESCRIPTION%}/g,data.description)
    output = output.replace(/{%ID%}/g,data.id)
    return output
}