var jwt = require('jsonwebtoken');

class loginDAO {


    constructor(connection) {
        this._connection = connection;
    }

    login(email, senha) {
        return new Promise((resolve, reject) => {

            var sql = `SELECT * FROM usuario WHERE email='${email}' and senha='${senha}' `;

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);

                if (result.length > 0) {

                    const payload = {
                        id: result[0].Id,
                        username: result[0].Nome
                    }

                    var token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 3600 // expira em 1 hora
                    });

                    resolve({ auth: true, mensagem: 'Login Válido!', token: token });

                } else {
                    resolve({ auth: false, mensagem: 'Email e/ou Senha incorretos!' });
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
                    resolve({ auth: false, mensagem: 'Esse email já foi cadastrado!' });
                } else {

                    let sql = `INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}')`;
                    this._connection.query(sql, function (err, result) {
                        if (err) return reject(err);
                        resolve({ auth: true, email, senha });
                    });
                }
            });
        });
    }
}

module.exports = loginDAO;

