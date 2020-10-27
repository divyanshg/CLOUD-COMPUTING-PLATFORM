module.exports = {
    checkAuthenticated: (req, res, next) => {

        if(req.isAuthenticated()){
            return next()
        }

        return res.redirect('/login')

    },
    checkNotAuthenticated: (req, res, next) => {

        if(req.isAuthenticated()){
            return res.redirect('/projects')
        }

        return next()
    }
}