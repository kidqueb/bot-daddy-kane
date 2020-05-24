const formatDistanceToNow = require('date-fns/formatDistanceToNow')
const START_TIME = new Date()

module.exports = ({ say }) => {
  const duration = formatDistanceToNow(START_TIME)
  say(`KidQueb has been streaming for ${duration}.`)
}