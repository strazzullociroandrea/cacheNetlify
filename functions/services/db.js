const sqlite3 = require("sqlite3");
const { Sequelize, DataTypes } = require('sequelize');
const shortid = require('shortid');
const generaToken = () => shortid.generate();
const mail = require("./mail.js");

const Database = async (conf, path) => {
    try {

        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path,
            logging: (sql) => {
              //  console.log(sql); //<-- per visualizzare in console le query sql che esegue
            }
        });

        const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: DataTypes.STRING,
            token: DataTypes.STRING,
        }, {
            timestamps: false
        });
        const Data = sequelize.define('Data', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            key: DataTypes.STRING,
            value: DataTypes.TEXT,
            idUser: DataTypes.INTEGER
        }, {
            timestamps: false
        });

        await sequelize.sync();

        const getData = async (token, key) => {
            try {
                let idUser = await User.findOne({
                    where: {
                        token: token
                    }
                })
                if (idUser) {
                    idUser = idUser.id;
                    const data = await Data.findOne({
                        where: {
                            idUser: idUser,
                            key: key
                        }
                    })
                    return { result: data || [] };
                } else {
                    return { result: "Token non valido" };
                }
            } catch (e) {
                throw (e);
            }
        }
        const insertData = async (token, key, value) => {
            try {
                const user = await User.findOne({ where: { token: token } });
                if (user) {
                    const existingData = await Data.findOne({ where: { idUser: user.id, key: key } });
                    if (existingData) {
                        await existingData.update({ value: value });
                        return { result: "Dato modificato con successo" };
                    } else {
                        await Data.create({ key: key, value: value, idUser: user.id });
                        return { result: "Dato inserito con successo" };
                    }
                } else {
                    return { result: "Token non valido" };
                }
            } catch (e) {
                throw (e);
            }
        }

        const register = async (email) => {
            try {
                let user = await User.findOne({
                    where: {
                        email: email
                    }
                });
                const token = generaToken();
                mail.send(
                    conf,
                    email,
                    conf.fromMail,
                    conf.subject,
                    conf.body.replace("%PASSWORD", token));
                if (user) {
                    await User.update({
                        token: token
                    }, {
                        where: {
                            email: email
                        }
                    });
                } else {
                    await User.create({
                        email: email,
                        token: token
                    })
                }
                return { result: "Ok" };
            } catch (e) {
                throw (e);
            }
        }
        const login = async (email, token) => {
            try {
                let user = await User.findOne({
                    where: {
                        email: email,
                        token: token
                    }
                });
                if (user != {} && user) {
                    return { login: true };
                } else {
                    return { login: false };
                }
            } catch (e) {
                throw (e);
            }
        }
        return {
            getData: getData,
            insertData: insertData,
            register: register,
            login: login
        }
    } catch (e) {
        throw (e);
    }
}

module.exports = Database;