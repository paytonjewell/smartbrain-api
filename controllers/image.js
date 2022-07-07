const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
});

const handleApiCall = (req, res) => {
    app.models.predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with API'))
}

const handleImageSubmission = (db) => (req, res) => {
    const {id} = req.body;

    db('users').where({id}).increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(() => res.status(400).json('unable to update entries'))

}

module.exports = {
    handleImageSubmission: handleImageSubmission,
    handleApiCall: handleApiCall
}