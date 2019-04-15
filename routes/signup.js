const express = require('express');
const router = express.Router();

const loginDAO = require('../dao/loginDAO');

/*  
!   /signup
*/

/*  
 *  Cadastrar checando se o email não está cadastrado já
 */
router.post('/', (req, res, next) => {
    let {
        nome,
        email,
        senha
    } = req.body;
    
    new loginDAO(req.connection)
        .signup(nome, email, senha)
        .then(result => {
            result.auth ?
                new loginDAO(req.connection)
                .login(email, senha)
                .then(result => {
                    result.auth ? res.status(200).json({
                        token: result.token,
                        username: result.username,
                    }) : res.status(401).json(result.mensagem)
                })
                .catch(next) :
                res.status(401).json(result.mensagem)
        })
        .catch(next)
});

module.exports = router;