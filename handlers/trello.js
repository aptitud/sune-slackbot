const Trello = require("node-trello")
const moment = require("moment")
const trelloApi = new Trello(process.env.TRELLO_APP_ID, process.env.TRELLO_APP_TOKEN)

const shorten = value => {
  const maxLength = 50
  const trimmedText = value.length > maxLength ? value.substring(0, maxLength) + "..." : value
  return trimmedText.replace(/\n/g, '')
}

const sendCard = (card, send) => {
  const board = trelloApi.get("/1/boards/" + card.idBoard, (err, data) => {

    data = data ||  {'name':'  board saknas (?)'}
    if (!data.closed) {
      const formattedMessage = `
          >*${shorten(card.name)}* på _ ${data.name}_ (${moment(card.dateLastActivity).format('LL')})
          >${shorten(card.desc) || "~ingen beskrivning~"}
          >${card.shortUrl}`

          send('\n')
          send(formattedMessage.replace(/^ +/gm, ''))
    }
  })
}

module.exports = tiny => {
  tiny.listen(/trello (.+)/i, (send, match) => {
    console.log(`Söker i trello efter ${match[1].trim()}`);
    const cards = trelloApi.get("/1/search", {
      query: match[1].trim(),
      cards_limit: 100,
      card_fields: 'idBoard,shortUrl,name,desc,dateLastActivity,closed'
    }, (err, data) => {
      console.log(data.cards);
      const uniqueCards = data.cards.filter(c => !c.closed).reduce((acc, val) => {
        return acc.indexOf(val) === -1
          ? acc.concat([val])
          : acc 
      }, [])

      send(`Hittade *${uniqueCards.length}* kort som innehåller *${match[1]}* \n Visar öppna kort på öppna tavlor `)
      uniqueCards.map(card => sendCard(card, send))
    })
  })
}