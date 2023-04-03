const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const moment = require('moment');

function router(req, res){
  let filePath = path.join(__dirname,'public' ,req.url === '/' ? 'index.html' : req.url)
  let extname = path.extname(filePath)
  let contentType
  switch(extname){
    case '.html':
      contentType = 'text/html'
      break
    case '.css':
      contentType = 'text/css'
      break
  }

  fs.readFile(filePath, (err, data)=>{
    if(err){
      res.writeHead(404)
      return res.end('404 not found')
    } else {
      res.writeHead(200, {'Content-Type': contentType})
      res.end(data)
    }
  })

   if (req.method === 'POST' && req.url === '/'){
    let body = '';
    req.on('data', (chunk)=>{
      body += chunk
    });

    req.on('end', () => {
      const data = qs.parse(body)
      const text = data['input-text']
      if(!text){
        res.writeHead(404)
        return res.end('404 not found')
      } else {
        const file = path.join(__dirname, 'public', text)
        let content
        try {
          content = fs.readFileSync(file, 'utf-8');
        } catch (err) {
          console.error(err);
        }
        console.log(content);
        fs.stat(file, (err, stats)=>{
          if(err){
            res.writeHead(404)
            return res.end('404 not found')
          } else {
            const fileName = path.basename(file)
            const fileSize = `${stats.size}KB`
            const creationTime = moment(stats.birthtime).format('LLLL')
            const modifiedTime = moment(stats.mtime).format('LT')
            res.writeHead(200,{'Content-Type': 'text/html'})
            res.write(`<p>File Name: ${fileName}</p>`)
            res.write(`<p>Size of file: ${fileSize}</p>`);
            res.write(`<p>Creation time: ${creationTime}</p>`);
            res.write(`<p>Modified time: ${modifiedTime}</p>`)
            res.write(`<p>Content: ${content}</p>`)
             res.write(`<button onclick="location.href='/'">Home</button>`)
            res.end()
          }
        })
      }
    })
  }
}

module.exports = router