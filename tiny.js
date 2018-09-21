module.exports = class Tiny {
  constructor(connection, slackOrganization, logger) {
    this.subscribers = []
    this.connection = connection
    this.slackOrganization = slackOrganization
    this.logger = logger

    this.connection.on('error', error => logger('connection.error', error.toString()))
    this.connection.on('close', () => logger('connection.close'))
    this.connection.on('message', message => this.handleMessage(message))

    this.loadModules('handlers')
    this.pingPong()
  }
  pingPong() {
    setInterval(() => this.send({ type: 'ping' }), 5000)
  }
  loadModules(folder) {
    const path = require('path').join(__dirname, folder)
    require('fs').readdirSync(path).forEach(file => {
      const modulex = require(`./${folder}/${file}`)
      modulex(this)
    })
  }
  send(message) {
    const payload = Object.assign({ id: new Date().getTime() }, message)
    this.logger('connection.sendUTF', payload)
    this.connection.sendUTF(JSON.stringify(payload))
  }
  handleMessage(message) {
    const msg = JSON.parse(message.utf8Data)
    switch (msg.type) {
      case 'message':
        for (let subscriber of this.subscribers) {
          const match = subscriber.regex.exec(msg.text)
          if (match) {
            subscriber.callback(text => this.send({ type: 'message', channel: msg.channel, text: text }), match)
          }
        }
        break
    }
  }
  listen(regex, callback) {
    this.subscribers.push({
      regex: regex,
      callback: callback
    })
  }
  speak(regex, callback) {
    const channels = this.slackOrganization.channels
    callback(text => {
      for (let channel of channels) {
        const match = regex.exec(channel.name)
        if (match) {
          this.send({ type: 'message', channel: channel.id, text: text })
        }
      }
    })
  }
}