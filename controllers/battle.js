import Battle from "../models/battle";
import csv from 'csvtojson';
import async from 'async';


/**
 * [list - get all battles list]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
export const list = (req, res, next) => {
    Battle.find({},'location', (err, battles) => {
        if (err) {
            return res.json({ code:400, message: "Internal server error"});
        }
        res.json({code:200, message: "Battles fetched successfully", data: battles });
    });
};

/**
 * [count - get all battles count]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
export const count = (req, res, next) => {
    Battle.count({}, (err, total) => {
        if (err) {
            return res.json({ code:400, message: "Internal server error"});
        }
        res.json({code:200, message: "Total battles fetched", data: total });
    });
};


/**
 * [searchBattle - get battels with king names]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
export const searchBattle = (req, res, next) => {
    let inputData = req.query;
    let query = {$or: [{'attacker_king': inputData.king}, {'defender_king': inputData.king}]}

    if(inputData.location)
       query.location =  inputData.location

    if(inputData.type)
       query.battle_type =  inputData.type 

    Battle.find(query, (err, battles) => {
        if (err) {
            return res.json({ code:400, message: "Internal server error"});
        }
        res.json({code:200, message: "Battles fetched", data: battles });
    });
};


export const add = (req, res) => {
    let filePath = './battles.csv'
    csv()
        .fromFile(filePath)
        .then((jsonObj) => {
            console.log("jsonObj", jsonObj);
            if (jsonObj.length) {
                 async.each(jsonObj, function(csvInfo, callback) {
                      const {
                        battle_number,
                        name,
                        year,
                        attacker_king,
                        defender_king,
                        attackers,
                        defenders,
                        attacker_outcome,
                        battle_type,
                        major_death,
                        major_capture,
                        attacker_size,
                        defender_size,
                        attacker_commander,
                        defender_commande,
                        summer,
                        location,
                        note,
                        region
                    } = csvInfo;
                    const newBattle = new Battle({
                        battle_number,
                        name,
                        year,
                        attacker_king,
                        defender_king,
                        attackers,
                        defenders,
                        attacker_outcome,
                        battle_type,
                        major_death,
                        major_capture,
                        attacker_size,
                        defender_size,
                        attacker_commander,
                        defender_commande,
                        summer,
                        location,
                        note,
                        region
                    });

                    newBattle.save(function(err) {
                        if (err) {
                            console.log("err",err);
                            callback('Internal server error')
                        } else {
                            callback()
                           
                        }
                    });
                   
                }, function(err) {
                    console.log('****DB err', err);
                    if (err) {
                        res.json({
                            code: 400,
                            message: err
                        });
                    } else {
                         res.json({
                                code: 200,
                                message: "Battle data added successfully!"
                            });

                    }
                })
            }

        })
};


export const statistics = (req, res, next) => {
};