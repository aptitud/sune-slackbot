const Trello = require("node-trello")
const moment = require("moment")
const trelloApi = new Trello(process.env.TRELLO_APP_ID, process.env.TRELLO_APP_TOKEN)

const shorten = value => {
  const maxLength = 50
  const trimmedText = value.length > maxLength ? value.substring(0, maxLength) + "..." : value
  return trimmedText.replace('\\n', '').replace('\r', '')
}

const sendCard = (card, send) => {
  const board = trelloApi.get("/1/boards/" + card.idBoard, (err, data) => {
    const formattedMessage = `
---------------------------------------
*${shorten(card.name)}* i _ ${data.name}_ (${moment(card.dateLastActivity).format('LL')})
${shorten(card.desc) || "~ingen beskrivning~"}
${card.shortUrl}`
    send(formattedMessage)
  })
}

module.exports = tiny => {
  tiny.listen(/trello (.+)/i, (send, match) => {
    const cards = trelloApi.get("/1/search", {
      query: match[1].trim(),
      cards_limit: 100,
      card_fields: 'idBoard,shortUrl,name,desc,dateLastActivity'
    }, (err, data) => {
      const uniqueCards = data.cards.reduce((acc, val) => {
        return acc.indexOf(val) === -1
          ? acc.concat([val])
          : acc 
      }, [])

      send(`Hittade *${uniqueCards.length}* kort som innehåller *${match[1]}*`)
      uniqueCards.map(card => sendCard(card, send))
    })
  })
}