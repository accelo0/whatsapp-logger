const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs')
const moment = require('moment');

moment.locale();
console.log('WWEB => CONNECTING');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'client-one'})
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
})
 
client.on('authenticated', (session) => {
  console.log('WWBEB => AUTHENTICATED')
});

client.on('ready', () => {
  console.log('WWEB => READY')
})

client.on('message_create', async (msg) => {
  let name = (await msg.getContact()).name;
  let number = (await msg.getContact()).number;

  let log = fs.readFileSync('./logs/log.txt')

  if(msg.type == 'ptt') {
    await console.log(`\n ---------- NEW AUDIO ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\nAudio Message - ${msg.duration}`)
    fs.writeFileSync('./logs/log.txt', log + `\n ---------- NEW AUDIO ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\nAudio Message - ${msg.duration}` )
  }
  if(msg.type == 'chat') {
    await console.log(`\n ---------- NEW MESSAGE ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\n${msg.body}${msg.hasMedia ? ' - Include Media' : ''} `)
    fs.writeFileSync('./logs/log.txt', log + `\n ---------- NEW MESSAGE ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\n${msg.body}${msg.hasMedia ? ' - Include Media' : ''} `)
  }
  if(msg.type == 'sticker') {
    await console.log(`\n ---------- NEW STICKER ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\n${msg._data.isAnimated ? 'Animated' : 'No Animated'}`)
    fs.writeFileSync('./logs/log.txt', log + `\n ---------- NEW STICKER ----------\n${moment().format('LTS')} ${name}:(${number}) - ${msg.deviceType}\n${msg._data.isAnimated ? 'Animated' : 'No Animated'}` )
  }

})

client.initialize()
