const Story = require('../models/story');
// const User = require('../models/story');


function storyIndex(req, res) {
  Story
    .find()
    .populate('createdBy')
    .exec()
    .then(stories => res.status(200).json(stories))
    .catch(err => res.status(500).json(err));
}

function storyCreate(req, res) {
  req.body.createdBy = req.user.id;
  // console.log(req.body);
  Story
    .create(req.body)
    .then(story => res.status(201).json(story))
    .catch(err => res.status(500).json(err));
}

function storyShow(req, res) {
  // console.log(req.params);
  Story
  .findById(req.params.id)
  .populate('createdBy')
  .exec()
  .then(story => res.status(200).json(story))
  .catch(err => res.status(500).json(err));
}

function storyUpdate(req, res) {

  Story
  .findById(req.params.id)
  .exec()
  .then(story => {
    if(!story) return res.status(404).json({ message: 'No story found!'});
    story.image = req.body.image;
    story.save();
  })
  .then(story => res.status(200).json(story))
  .catch(err=> res.status(500).json(err));
}

module.exports = {
  index: storyIndex,
  create: storyCreate,
  show: storyShow,
  update: storyUpdate
};
