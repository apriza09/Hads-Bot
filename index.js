/*
   Halo nama gw hads.
   Disini gw iseng nyoba buat case example dari [ https://api.i-tech.id ] 
   dan api gw [ https://hads09-api.herokuapp.com/ ]
   Original Base created by [ Mhankbarbar ].
   
   Mau pakai? silahkan tapi jangan lu hapus juga thanks to nya:)
   ngotak lah kawan
   
   Mau ambil case nya doang? silahkan tapi jangan lupa
   cantumin thanks to nya:)
   
   Jika menemukan error silahkan fix sendiri 
   disini gw cuma ngasih example case!
   
   Before using use your brain!

*/
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const { exec, spawn, execSync } = require("child_process")
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')
const { removeBackgroundFromImageFile } = require('remove.bg')
const setiker = JSON.parse(fs.readFileSync('./src/stik.json'))
const videonye = JSON.parse(fs.readFileSync('./src/video.json'))
const audionye = JSON.parse(fs.readFileSync('./src/audio.json'))
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'))
const imagenye = JSON.parse(fs.readFileSync('./src/image.json'))
const setting = JSON.parse(fs.readFileSync('./src/settings.json'))
const event = JSON.parse(fs.readFileSync('./database/event.json'))
const antilinkig = JSON.parse(fs.readFileSync('./database/antilinkig.json'))
prefix = setting.prefix
TKey = setting.TKey
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)}J ${pad(minutes)}M ${pad(seconds)}D`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const jam = moment.tz('Asia/Jakarta').format('HH:mm')
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
   		        var pes = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			const botNumber = client.user.jid
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const totalchat = await client.chats.all()
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isOwner = ownerNumber.includes(sender)
			const isEventon = isGroup ? event.includes(from) : false
			const isAntiLinkIg = isGroup ? antilinkig.includes(from) : false
			const isAntilink = isGroup ? antilink.includes(from) : false
			const conts = mek.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
			const pushname = mek.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || '-'
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const freply = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": `${command}`, "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/logo.jpeg')} } }
			const had = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: `0@s.whatsapp.net` } : {}) }, message: { 'contactMessage': { 'displayName': `${pushname}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Hads Bot,;;;\nFN:Hads Bot,\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': fs.readFileSync('./image/logo.jpeg')}}}

			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "_SelfBot client City_", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/logo.jpeg')} } }, contextInfo: {"mentionedJid": memberr}})
			}
			mess = {
			wait: `Please Wait...`,
			linkga: `URL Invalid!`
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			let authorname = client.contacts[from] != undefined ? client.contacts[from].vname || client.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
 	    
            function addMetadata(packname, author) {	// by Mhankbarbar
				if (!packname) packname = 'made by admin'; if (!author) author = 'made by admin';	
				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./stickers/${name}.exif`)) return `./stickers/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

				let len = JSON.stringify(json).length	
				let last	

				if (len > 256) {	
					len = len - 256	
					bytes.unshift(0x01)	
				} else {	
					bytes.unshift(0x00)	
				}	

				if (len < 16) {	
					last = len.toString(16)	
					last = "0" + len	
				} else {	
					last = len.toString(16)	
				}	

				const buf2 = Buffer.from(last, "hex")	
				const buf3 = Buffer.from(bytes)	
				const buf4 = Buffer.from(JSON.stringify(json))	

				const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

				fs.writeFile(`./stickers/${name}.exif`, buffer, (err) => {	
					return `./stickers/${name}.exif`	
				})	

			}
		/*===========<FUNCTION ANTILINK GROUP>===========*/
        if (messagesC.includes("://chat.whatsapp.com/")){
		if (!isGroup) return
		if (!isAntilink) return
		if (isGroupAdmins) return reply('karena kamu adalah admin group, bot tidak akan kick kamu')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#izinadmin")) return reply("#izinadmin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`Link Group Terdeteksi maaf ${sender.split("@")[0]} anda akan di kick dari group 5detik lagi`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 5000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
			reply("Waitt...")
		}, 4000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
			reply("Siapp siap aja dulu yekan:v")
		}, 3000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
			reply("Siapp?")
		}, 2000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
			reply("Bismillah")
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
			reply("Byee xontol :v")
		}, 0)
	}
	
            
			switch(command) {
			case 'menu':
			case 'help':
			runtime = process.uptime()
			client.sendMessage(from, `「 *BOT WHATSAPP* 」

*===[ INFO ]===*
> Time: ${jam} WIB
> Runtime: ${kyun(runtime)}
> Bot Whatsapp By Hads
> Repo:
https://github.com/apriza09/Hads-Bot

*===> ANIME <===*
> ${prefix}dewabatch
> ${prefix}kusonime
> ${prefix}otakusearch
> ${prefix}otakulatest
> ${prefix}wibu
> ${prefix}ranime
> ${prefix}ranime2
> ${prefix}neko
> ${prefix}neko2
> ${prefix}hentai
> ${prefix}yuri
> ${prefix}dva
> ${prefix}trap
> ${prefix}hug
> ${prefix}baguette
> ${prefix}nsfwneko
> ${prefix}wink
> ${prefix}pat
> ${prefix}nimehug

*===> DOWNLOADER <===*
> ${prefix}ytmp3
> ${prefix}ytmp4
> ${prefix}fb
> ${prefix}igfoto
> ${prefix}igvid

*===> TOOLS & OTHERS <===*
> ${prefix}chord
> ${prefix}lirik
> ${prefix}cuaca
> ${prefix}gempa
> ${prefix}jadwalsholat
> ${prefix}jamdunia
> ${prefix}ssweb
> ${prefix}alay
> ${prefix}hilih
> ${prefix}ninja
> ${prefix}quotes
> ${prefix}quotes2
> ${prefix}quotes3
> ${prefix}rnama
> ${prefix}animalfact
> ${prefix}fakta
> ${prefix}pantunpakboy
> ${prefix}kbbi
> ${prefix}artinama
> ${prefix}bcrypt
> ${prefix}md5
> ${prefix}sha1
> ${prefix}sha256
> ${prefix}sha512
> ${prefix}base32en
> ${prefix}base32de
> ${prefix}base64en
> ${prefix}base64de
> ${prefix}shorturl
> ${prefix}cekip

*==> THANKS <==*
> adiwajshing/Baileys
> Mhankbarbar

「 *CREATED BY HADS* 」`, MessageType.text, {quoted: had})
break
case 'kusonime':
if (args.lenght < 1) return reply('Masukan Parameter Query')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/kusonime?key=${TKey}&query=${args.join(' ')}`, {method: 'get'})
asu = await getBuffer(anu.image)
teks = `*RESULT :*\n`
teks += `*➻ Title:* ${anu.title}\n`
teks += `*➻ Sinopsis:* ${anu.sinopsis}\n`
teks += `*➻ Keterangan:* ${anu.keterangan}\n`
teks += `*➻ Download:* ${anu.download}\n`
client.sendMessage(from, asu, image, {quoted: had, caption: teks})
break
case 'dewabatch':
if (args.lenght < 1) return reply('Masukan Parameter Query')
reply(mess.wait)
nime = await fetchJson(`https://api.i-tech.id/anim/dewabatch?key=${TKey}&query=${args.join(' ')}`, {method: 'get'})
img = await getBuffer(nime.image)
teks = `*RESULT :*\n`
teks += `*➻ Title:* ${nime.title}\n`
teks += `*➻ Sinopsis:* ${nime.sinopsis}\n`
teks += `*➻ Keterangan:* ${nime.keterangan}\n`
client.sendMessage(from, img, image, {quoted: had, caption: teks})
break
case 'otakusearch':
if (args.lenght < 1) return reply('Masukan Parameter Query')
reply(mess.wait)
data = await fetchJson(`https://api.i-tech.id/anim/otaku?key=${TKey}&type=search&query=${args.join(' ')}`, {method: 'get'})
teks = '#############################\n'
for (let i of data.result) {
teks += `*Title* : ${i.title}\n*link* : ${i.link}\n*Category* : ${i.category}\n*Date* : ${i.date}\n###########################\n`
}
reply(teks.trim())
break
case 'otakulatest':
if (args.lenght < 1) return reply('Masukan Parameter Query')
reply(mess.wait)
data = await fetchJson(`https://api.i-tech.id/anim/otaku?key=${TKey}&type=latest&query=${args.join(' ')}`, {method: 'get'})
teks = '#############################\n'
for (let i of data.result) {
teks += `*Title* : ${i.title}\n*Image* : ${i.img}\n*link* : ${i.link}\n*Category* : ${i.category}\n*Date* : ${i.date}\n###########################\n`
}
reply(teks.trim())
break 
case 'wink':
ranp = getRandom('.gif')
rano = getRandom('.webp')
anu = await fetchJson(`https://api.i-tech.id/tools/wink?key=${TKey}`, {method: 'get'})
reply(mess.wait)
exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
fs.unlinkSync(ranp)
buffer = fs.readFileSync(rano)
client.sendMessage(from, buffer, sticker, {quoted: had})
fs.unlinkSync(rano)
})
break
case 'pat':
ranp = getRandom('.gif')
rano = getRandom('.webp')
anu = await fetchJson(`https://api.i-tech.id/tools/pat?key=${TKey}`, {method: 'get'})
reply(mess.wait)
exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
fs.unlinkSync(ranp)
buffer = fs.readFileSync(rano)
client.sendMessage(from, buffer, sticker, {quoted: had})
fs.unlinkSync(rano)
})
break
case 'nimehug':
ranp = getRandom('.gif')
rano = getRandom('.webp')
anu = await fetchJson(`https://api.i-tech.id/tools/hug?key=${TKey}`, {method: 'get'})
reply(mess.wait)
exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
fs.unlinkSync(ranp)
buffer = fs.readFileSync(rano)
client.sendMessage(from, buffer, sticker, {quoted: had})
fs.unlinkSync(rano)
})
break
//=============\\
case 'hentai':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/hentai?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'yuri':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/yuri?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'dva':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/dva?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'trap':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/trap?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'hug':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/hug?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'nsfwneko':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/nsfwneko?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
case 'baguette':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/baguette?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Tobat Bang'})
break
//========\\
case 'ranime':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/anime?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Nih Bang'})
break
case 'ranime2':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/anime2?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Nih bang'})
break
case 'neko':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/neko?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Nih Bang'})
break
case 'neko2':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/anim/neko2?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, teks, text, {quoted: had, caption: 'Nih Bang'})
break
case 'wibu':
anu = await fetchJson(`https://api.i-tech.id/anim/wibu?key=${TKey}`, {method: 'get'})
img = await getBuffer(anu.foto)
teks = `*➻ Nama:* ${anu.nama}\n`
teks += `*➻ Desc:* ${anu.deskripsi}\n`
teks += `*➻ Sumber:* ${anu.sumber}\n`
client.sendMessage(from, img, image, {quoted: had, caption: teks})
break
case 'cekip':
ip = await fetchJson(`https://api.i-tech.id/tools/ipsaya?key=${TKey}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Registered:* ${ip.registered}\n`
teks += `*➻ Date & Time:* ${ip.datetime}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'jadwalsholat':
if (args.lenght < 1) return reply('Masukan Nama Daerah')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/sholat?key=${TKey}&kota=${args.join(' ')}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Terbit:* ${anu.terbit}\n`
teks += `*➻ Imsak:* ${anu.imsak}\n`
teks += `*➻ Subuh:* ${anu.subuh}\n`
teks += `*➻ Dhuha:* ${anu.dhuha}\n`
teks += `*➻ Dzuhur:* ${anu.dzuhur}\n`
teks += `*➻ Ashar:* ${anu.ashar}\n`
teks += `*➻ Maghrib:* ${anu.maghrib}\n`
teks += `*➻ Isya:* ${anu.isya}\n`
teks += `*➻ Kota:* ${anu.kota}\n`
teks += `*➻ Tanggal:* ${anu.tanggal}\n`
teks += `*➻ Catatan:* ${anu.note}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'gempa':
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/bmkg?key=${TKey}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Tanggal:* ${anu.result.infogempa.gempa.Tanggal}\n`
teks += `*➻ Jam:* ${anu.result.infogempa.gempa.Jam}\n`
teks += `*➻ Koordinat:* ${anu.result.infogempa.gempa.point.coordinates}\n`
teks += `*➻ Lintang:* ${anu.result.infogempa.gempa.Lintang}\n`
teks += `*➻ Bujur:* ${anu.result.infogempa.gempa.Bujur}\n`
teks += `*➻ Magnitude:* ${anu.result.infogempa.gempa.Magnitude}\n`
teks += `*➻ Kedalaman:* ${anu.result.infogempa.gempa.Kedalaman}\n`
teks += `*➻ Symbol:* ${anu.result.infogempa.gempa._symbol}\n`
teks += `*➻ Wilayah 1:* ${anu.result.infogempa.gempa.Wilayah1}\n`
teks += `*➻ Wilayah 2:* ${anu.result.infogempa.gempa.Wilayah2}\n`
teks += `*➻ Wilayah 3:* ${anu.result.infogempa.gempa.Wilayah3}\n`
teks += `*➻ Wilayah 4:* ${anu.result.infogempa.gempa.Wilayah4}\n`
teks += `*➻ Wilayah 5:* ${anu.result.infogempa.gempa.Wilayah5}\n`
teks += `*➻ Potensi:* ${anu.result.infogempa.gempa.Potensi}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'ssweb':
if (args.lenght < 1) return reply('Masukan Url')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/ssweb?key=${TKey}&link=${args.join(' ')}`, {method: 'get'})
img = await getBuffer(anu.result)
client.sendMessage(from, img, image, {quoted: had, caption: 'Nih'})
break
case 'jamdunia':
if (args.length < 1) return reply('Masukan Nama Kota')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/jam?key=${TKey}&kota=${args.join(' ')}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Timezone:* ${anu.timezone}\n`
teks += `*➻ Date:* ${anu.date}\n`
teks += `*➻ Time:* ${anu.time}\n`
teks += `*➻ Latitude:* ${anu.latitude}\n`
teks += `*➻ Longitude:* ${anu.longitude}\n`
teks += `*➻ Addres:* ${anu.addres}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'ytmp3':
if (args.lenght < 1) return reply('Masukan Parameter Url')
if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply('Link Nya Tidak Valid Kak')
reply(mess.wait)
anu = await fetchJson(`https://hads09-api.herokuapp.com/api/download/ytmp3?url=${args[0]}&apikey=HadsGans`)
img = await getBuffer(anu.result.thumb)
lagu = await getBuffer(anu.result.audio)
teks = `*➻ Title:* ${anu.result.title}\n`
teks += `*➻ Channel:* ${anu.result.channel}\n`
teks += `*➻ Views:* ${anu.result.views}\n`
teks += `*➻ Published:* ${anu.result.published}\n`
teks += `*「 ❗ 」Proses Mengirim Audio*\n`
client.sendMessage(from, img, image, {quoted: had, caption: teks})
client.sendMessage(from, lagu, audio, { mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: had})
break
case 'ytmp4':
if (args.lenght < 1) return reply('Masukan Parameter Url')
if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply('Link Nya Tidak Valid Kak')
reply(mess.wait)
anu = await fetchJson(`https://hads09-api.herokuapp.com/api/download/ytmp3?url=${args[0]}&apikey=HadsGans`, {method: 'get'})
lagu = await getBuffer(anu.result.video)
teks = `*➻ Title:* ${anu.result.title}\n`
teks += `*➻ Channel:* ${anu.result.channel}\n`
teks += `*➻ Views:* ${anu.result.views}\n`
teks += `*➻ Published:* ${anu.result.published}\n`
teks += `*「 ❗ 」Proses Mengirim Video*\n`
client.sendMessage(from, lagu, video, { mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: had, caption: teks})
break
case 'igvid':
if (args.lenght < 1) return reply('Masukan Parameter Url')
if (!isUrl(args[0]) && !args[0].includes('instagram')) return reply('Link Nya Tidak Valid Kak')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/dl/igdl?key=${TKey}&link=${args[0]}`, {method: 'get'})
lagu = await getBuffer(anu.result.url)
img = await getBuffer(anu.result.thumbnail)
teks = `*➻ Username:* ${anu.username}\n`
teks += `*➻ Caption:* ${anu.caption}\n`
teks += `*➻ Likes:* ${anu.likes}\n`
teks += `*➻ Comments:* ${anu.comments}\n`
teks += `*➻ Type:* ${anu.typename}\n`
teks += `*「 ❗ 」Proses Mengirim Media*\n`
client.sendMessage(from, lagu, video, { mimetype: 'video/mp4', filename: `${anu.username}.mp4`, quoted: had, caption: teks})
break
case 'igfoto':
if (args.lenght < 1) return reply('Masukan Parameter Url')
if (!isUrl(args[0]) && !args[0].includes('instagram')) return reply('Link Nya Tidak Valid Kak')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/dl/igdl?key=${TKey}&link=${args[0]}`, {method: 'get'})
lagu = await getBuffer(anu.result.url)
img = await getBuffer(anu.result.thumbnail)
teks = `*➻ Username:* ${anu.username}\n`
teks += `*➻ Caption:* ${anu.caption}\n`
teks += `*➻ Likes:* ${anu.likes}\n`
teks += `*➻ Comments:* ${anu.comments}\n`
teks += `*➻ Type:* ${anu.typename}\n`
teks += `*「 ❗ 」Proses Mengirim Media*\n`
client.sendMessage(from, lagu, video, { mimetype: 'image/jpeg', filename: `${anu.username}.jpg`, quoted: had, caption: teks})
break
case 'fb':
if (args.lenght < 1) return reply('Masukan Parameter Url')
if (!isUrl(args[0]) && !args[0].includes('facebook')) return reply('Link Nya Tidak Valid Kak')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/dl/fb?key=${TKey}&link=${args[0]}`, {method: 'get'})
asu = await getBuffer(anu.thumbnail)
teks = `*➻ Title:* ${anu.title}\n`
teks += `*➻ Desc:* ${anu.desc}\n`
teks += `*➻ Resolution:* ${anu.result[0].resolution}\n`
teks += `*➻ Format:* ${anu.result[0].format}\n`
teks += `*➻ Type:* ${anu.result[0].type}\n`
teks += `*➻ Size:* ${anu.result[0].size}\n`
teks += `*➻ Download:* ${anu.result[0].url}\n`
client.sendMessage(from, asu, image, {quoted: had, caption: teks})
break
case 'bcrypt':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/bcrypt?key=${TKey}&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'md5':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/md5?key=${TKey}&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'sha1':
case 'sha256':
case 'sha512':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/sha?key=${TKey}&type=${command}&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'base32en':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/bs32?key=${TKey}&type=encode&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'base32de':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/bs32?key=${TKey}&type=decode&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'base64en':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/bs64?key=${TKey}&type=encode&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'base64de':
if (args.lenght < 1) return reply('Masukan Parameter String')
anu = await fetchJson(`https://api.i-tech.id/hash/bs64?key=${TKey}&type=decode&string=${args.join(' ')}`, {method: 'get'})
teks = `*➻ String:* ${anu.string}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'artinama':
if (args.lenght < 1) return reply('Masukan Parameter Nama')
anu = await fetchJson(`https://api.i-tech.id/tools/arti?key=${TKey}&nama=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.arti}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'kbbi':
if (args.lenght < 1) return reply('Masukan Parameter Query')
anu = await fetchJson(`https://api.i-tech.id/tools/kbbi?key=${TKey}&query=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Kata:* ${anu.result[0].kata}\n`
teks += `*➻ Arti:* ${anu.result[0].arti}\n`
teks += `*➻ Sumber:* ${anu.sumber}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'pantunpakboy':
anu = await fetchJson(`https://api.i-tech.id/tools/pantun?key=${TKey}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'fakta':
anu = await fetchJson(`https://api.i-tech.id/tools/fakta?key=${TKey}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'animalfact':
if (args.lenght < 1) return reply('Masukan Nama Hewan\nContoh: cat')
anu = await fetchJson(`https://api.i-tech.id/tools/fact?key=${TKey}&animal=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Name:* ${anu.type}\n`
teks += `*➻ Result:* ${anu.result}\n`
teks += `*➻ Created:* ${anu.createdAt}\n`
teks += `*➻ Updated:* ${anu.updatedAt}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'shorturl':
if (args.lenght < 1) return reply('Masukan Url')
anu = await fetchJson(`https://api.i-tech.id/tools/shorturl?key=${TKey}&link=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'rnama':
if (args.lenght < 1) return reply('Masukan Gender')
anu = await fetchJson(`https://api.i-tech.id/tools/nama?key=${TKey}&gender=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'quotes':
anu = await fetchJson(`https://api.i-tech.id/tools/quotes?key=${TKey}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'quotes2':
anu = await fetchJson(`https://api.i-tech.id/tools/quotes2?key=${TKey}`, {method: 'get'})
teks = `*➻ Author:* ${anu.author}\n`
teks += `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'quotes3':
anu = await fetchJson(`https://api.i-tech.id/tools/quotes3?key=${TKey}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'alay':
if (args.lenght < 1) return reply('Masukan Text')
anu = await fetchJson(`https://api.i-tech.id/tools/alay?key=${TKey}&kata=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'hilih':
if (args.lenght < 1) return reply('Masukan Text')
anu = await fetchJson(`https://api.i-tech.id/tools/hilih?key=${TKey}&kata=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'ninja':
if (args.lenght < 1) return reply('Masukan Text')
anu = await fetchJson(`https://api.i-tech.id/tools/ninja?key=${TKey}&kata=${args.join(' ')}`, {method: 'get'})
teks = `*➻ Result:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'chord':
if (args.lenght < 1) return reply('Masukan Judul Lagu')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/chord?key=${TKey}&query=${args.join(' ')}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Chord:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'lirik':
if (args.lenght < 1) return reply('Masukan Judul Lagu')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/lirik?key=${TKey}&query=${args.join(' ')}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Lirik:* ${anu.result}\n`
client.sendMessage(from, teks, text, {quoted: had})
break
case 'cuaca':
if (args.lenght < 1) return reply('Masukan Nama Daerah')
reply(mess.wait)
anu = await fetchJson(`https://api.i-tech.id/tools/cuaca?key=${TKey}&kota=${args.join(' ')}`, {method: 'get'})
teks = `*RESULT :*\n`
teks += `*➻ Tempat:* ${anu.tempat}\n`
teks += `*➻ Cuaca:* ${anu.cuaca}\n`
teks += `*➻ Deskripsi:* ${anu.deskripsi}\n`
teks += `*➻ Suhu:* ${anu.suhu}\n`
teks += `*➻ Kelembapan:* ${anu.kelembapan}\n`
teks += `*➻ Udara:* ${anu.udara}\n`
client.sendMessage(from, teks, text, {quoted: had})
break

                            }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
//SPECIALS THANKS FOR MHANKBARBAR