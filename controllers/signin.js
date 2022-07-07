const handleSignIn = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(() => res.status(400).json('Unable to retrieve user'))
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(() => res.status(400).json('Wrong credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
}