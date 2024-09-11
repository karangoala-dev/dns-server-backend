const dgram = require('node:dgram');
const dnsPacket = require('dns-packet');

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    const incomingMessage = dnsPacket.decode(msg);
    console.log({
        qns: incomingMessage.questions,
        rinfo
    });

    // const ipFromDb = db[incomingMessage.questions[0].name]; // query from DB here to get data
    const ipFromDb = '1.2.3.4';
    
    const ans = dnsPacket.encode({
        type: 'response',
        id: incomingMessage.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions: incomingMessage.questions,
        answers: [{
            type: 'A',
            class: 'IN',
            name: incomingMessage.questions[0].name,
            data: ipFromDb
        }]
    });
    server.send(ans, rinfo.port, rinfo.address);
})

server.bind(53, () => {
    console.log('DNS server is running on port 53');
})