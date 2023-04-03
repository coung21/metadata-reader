const http = require('http');
const router = require('./router')

const server = http.createServer(router);

const PORT = process.env.PORT || 5000

server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})