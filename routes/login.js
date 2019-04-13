const express = require('express');
const router = express.Router();

const loginDAO = require('../dao/loginDAO');

/*  
!   /login
*/

/*  
*  Logar checando se o email/senha estão corretos
*/

router.post('/', (req, res, next) => {
    let { email, senha } = req.body;
    

    new loginDAO(req.connection)
        .login(email, senha)
        .then(result => {
            result.auth ? res.status(200).json(result.token) : res.status(401).json(result.mensagem)
        })
        .catch(next)
}
);




module.exports = router;