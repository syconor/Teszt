const wssc   = require('websocket').server  //  --> npm i websocket
const static = require('node-static')         //  --> npm i node-static
const file = new static.Server('./dist')

const server = require('http')
    .createServer( (request, response) => {
        request.addListener('end', () => {
            file.serve(request, response);
        }).resume()
    })

wsServer = new wssc( { httpServer: server, autoAcceptConnections: false } )

var ct = []
var id1 = 0
var id2 = 0
var x =0

wsServer.on( 'request', r => {
        ct.push( r.accept('echo-protocol',r.origin) )
        ct[ct.length - 1].on( 'message', m => {
            let msg = JSON.parse(m.utf8Data)
            perc=new Date().getMinutes()
            ora=new Date().getHours()
            sec=new Date().getSeconds()
            console.log(m.utf8Data);
            ct.forEach( (v,k) => v.sendUTF(msg.id + ':' + msg.msg) )
            console.log(typeof msg.msg[0]);
            //console.log(msg.id, msg.msg);
            if (id1==0) {
                  id1=msg.id
            }
            else {
                  if (id2==0) {
                    id2=msg.id
                    if (id1==id2) {
                      id2=0
                    }
                  }
            }
            console.log(id1,id2);

            if (msg.msg[0]=="3") {
              id1=0
              id2=0
              x=0
              console.log(id1,id2);
            }

            if ((id1>0 && id2>0) && x==0) {
                let q=Math.floor(Math.random())
                x=1
                if (q==0){
                    msg.id=id1
                    msg.msg = "50;50"
                    ct.forEach( (v,k) => v.sendUTF(msg.id + ':' + msg.msg) )
                    msg.id=id2
                    msg.msg = "51;51"
                    ct.forEach( (v,k) => v.sendUTF(msg.id + ':' + msg.msg) )
                }
                else{
                  msg.id=id2
                  msg.msg = "50;50"
                  ct.forEach( (v,k) => v.sendUTF(msg.id + ':' + msg.msg) )
                  msg.id=id1
                  msg.msg = "51;51"
                  ct.forEach( (v,k) => v.sendUTF(msg.id + ':' + msg.msg) )
                }
            }
        })
} )


server.listen(3000, () => {
    console.log(`
        ws server elérhető a 3000-es porton
    `)
})
