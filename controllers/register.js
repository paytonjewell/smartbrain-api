const handleRegister = (db, bcrypt) => (req, res) => {
    const {email, name, password} = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission')
    }

    const hash = bcrypt.hashSync(password)

    db.transaction(trx => {
        trx.insert({
            hash,
            email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                let internalEmail = loginEmail[0].email
                return trx('users')
                    .returning('*')
                    .insert({
                        email: internalEmail,
                        name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(() => res.status(400).json('Unable to complete registration'))
}

module.exports = {
    handleRegister: handleRegister
}