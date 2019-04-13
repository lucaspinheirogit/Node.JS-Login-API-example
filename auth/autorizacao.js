const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: function (req, res, next) {  
        var token = req.get('authorization');
        if (token !== undefined) {
            if (token.length > 0) {
                jwt.verify(token, process.env.SECRET, (error, user) => {
                    if (error) throw error;
                    req.user = user;
                    console.log("AUTORIZADO");
                    next();
                });
            } else {
                throw new Error('NAO AUTORIZADO');
            }
        }else{
            throw new Error('NAO AUTORIZADO');
        }
    }
}