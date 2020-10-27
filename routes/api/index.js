const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../authorizers/users')

router.get('/connections', checkAuthenticated, (req, res) => {
    res.json([{
            "x": 1996,
            "y": 322
        },
        {
            "x": 1997,
            "y": 324
        },
        {
            "x": 1998,
            "y": 329
        },
        {
            "x": 1999,
            "y": 342
        },
        {
            "x": 2000,
            "y": 348
        },
        {
            "x": 2001,
            "y": 334
        },
        {
            "x": 2002,
            "y": 325
        },
        {
            "x": 2003,
            "y": 316
        },
        {
            "x": 2004,
            "y": 318
        },
        {
            "x": 2005,
            "y": 330
        },
        {
            "x": 2006,
            "y": 355
        },
        {
            "x": 2007,
            "y": 366
        },
        {
            "x": 2008,
            "y": 337
        },
        {
            "x": 2009,
            "y": 352
        },
        {
            "x": 2010,
            "y": 377
        },
        {
            "x": 2011,
            "y": 383
        },
        {
            "x": 2012,
            "y": 344
        },
        {
            "x": 2013,
            "y": 366
        },
        {
            "x": 2014,
            "y": 389
        },
        {
            "x": 2015,
            "y": 334
        }
    ])
})

module.exports = router