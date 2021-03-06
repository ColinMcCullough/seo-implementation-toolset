const models = require('../models')
const slack = require('./slack')
module.exports = {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback
}

async function createFeedback (author, feedbackType, feedbackText, status) {
  const feedback = await models.feedback.create({
    author,
    feedbackType,
    feedbackText,
    status
  })
  slack.onFeedback({ text: feedbackText })
  return feedback
}

async function getFeedback () {
  const feedback = await models.feedback.findAll()
  return feedback
}

async function updateFeedback (id, status, resolutionNotes) {
  const feedback = await models.feedback.update({ status, resolutionNotes }, { where: { id } })
  return feedback
}

function deleteFeedback (id) {
  return models.feedback.destroy({
    where: { id }
  })
}
