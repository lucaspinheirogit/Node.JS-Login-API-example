const express = require('express');
const router = express.Router();

/*  
!   /test
*/

router.get('/', (req, res, next) => {
    res.json({
        "message": "Hello World!"
    })
});

module.exports = router;