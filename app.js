const rp = require('request-promise')
const Tiny = require('./tiny')
const WebSocketClient = require('websocket').client

const start = async (url, logger) => {
  const slackOrganization = await rp(url).then(response => JSON.parse(response))
  const socket = new WebSocketClient()
  socket.on('connectFailed', error => logger('socket.connectFailed', error.toString()))
  socket.on('connect', connection => new Tiny(connection, slackOrganization, logger))
  socket.connect(slackOrganization.url)
}

const logger = (message, extra) => console.log(message || 'unknown', extra)
start(`https://slack.com/api/rtm.start?token=${process.env.SLACK_TOKEN}`, logger)