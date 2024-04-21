const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const Database = require("./services/db.js");
const fs = require("fs");
const cors = require("cors");
const conf = JSON.parse(fs.readFileSync("conf.json"));
const log = require("./services/log.js");

(async () => {

    const db = await Database(conf, "database.sqlite");
    const corsOptions = {
        origin: "*",
        methods: "POST",
        optionsSuccessStatus: 204,
    };
    app.use(cors(corsOptions));

    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    router.post("/getData",async(request, response)=>{
        try{
            const token = request.headers.authorization;
            const { key} = request.body;
            if(token && token != "" && key && key != ""){
                const rsp = await db.getData(token, key);
                response.json(rsp);
            }else{
                response.json({result:false});
            }
        }catch(e){
            log(e);
        }
    })
    router.post("/insertData",async(request, response)=>{
        try{
            const token = request.headers.authorization;
            const {key, value} = request.body;
            if(token && token != "" && key && key != "" && value && value != ""){
                const rsp = await db.insertData(token, key, value);
                response.json(rsp);
            }else{
                response.json({result: false});
            }
        }catch(e){
            log(e);
        }
    });

    router.post("/register",async(request, response)=>{
        try{
            const {email} = request.body;
            if(email && email != "" ){
                const rsp = await db.register(email);
                response.json(rsp);
            }else{
                response.json({result:false});
            }
        }catch(e){
            log(e);
        }
        
    })
    
    router.post("/login",async(request, response)=>{
        try{
            const {email, token} = request.body;
                if(email && email != "" && token && token != ""){
                    const rsp = await db.login(email,token);
                    response.json(rsp);
                }else{
                    response.json({login: false});
                }
            
        }catch(e){
            log(e);
        }
        
    })
    router.get("/showlog", async (req, res) => {
        const logData = JSON.parse(fs.readFileSync("log.txt"));
        res.json(logData);
    });
    // Collegamento delle route
    app.use("/.netlify/functions/api", router);

    // Esporta l'app per l'utilizzo con serverless
    module.exports.handler = serverless(app);
})();

/**
 * per richiamare i servizi
 * https://cacheremota.netlify.app/.netlify/functions/api/saluta
 * altrimenti
 * https://cacheremota.netlify.app/
 */

