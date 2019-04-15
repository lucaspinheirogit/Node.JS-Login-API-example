var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class loginDAO {

    constructor(connection) {
        this._connection = connection;
    }

    login(email, senha) {
        return new Promise((resolve, reject) => {

            var sql = `SELECT * FROM usuario WHERE email='${email}'`;

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                if (result.length > 0) {

                    console.log(result[0].Senha);

                    if (bcrypt.compareSync(senha, result[0].Senha)) {
                        const payload = {
                            id: result[0].Id,
                            username: result[0].Nome
                        }

                        var token = jwt.sign(payload, process.env.SECRET, {
                            expiresIn: 36000 // expira em 1 hora
                        });

                        resolve({
                            auth: true,
                            mensagem: 'Login Válido!',
                            token: token,
                            username: payload.username,
                        });
                    } else {
                        resolve({
                            auth: false,
                            mensagem: 'Email e/ou Senha incorretos!'
                        });
                    }


                } else {
                    resolve({
                        auth: false,
                        mensagem: 'Email e/ou Senha incorretos!'
                    });
                }
            })
        });
    }

    signup(nome, email, senha) {
        return new Promise((resolve, reject) => {

            let sql = `SELECT * FROM usuario WHERE email='${email}'`;

            this._connection.query(sql, function (err, result, fields) {
                if (err) return reject(err);
                if (result.length > 0) {
                    resolve({
                        auth: false,
                        mensagem: 'Esse email já foi cadastrado!'
                    });
                } else {

                    let hash = bcrypt.hashSync(senha, 3);

                    let sql = `INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${hash}')`;
                    console.log(sql);

                    this._connection.query(sql, function (err, result) {
                        if (err) return reject(err);
                        resolve({
                            auth: true,
                            email,
                            senha
                        });
                    });

                }
            });
        });
    }
}

module.exports = loginDAO;