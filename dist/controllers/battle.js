'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.statistics = exports.add = exports.searchBattle = exports.count = exports.list = undefined;

var _battle = require('../models/battle');

var _battle2 = _interopRequireDefault(_battle);

var _csvtojson = require('csvtojson');

var _csvtojson2 = _interopRequireDefault(_csvtojson);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * [list - get all battles list]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
var list = exports.list = function list(req, res, next) {
    _battle2.default.find({}, 'location', function (err, battles) {
        if (err) {
            return res.json({ code: 400, message: "Internal server error" });
        }
        res.json({ code: 200, message: "Battles fetched successfully", data: battles });
    });
};

/**
 * [count - get all battles count]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
var count = exports.count = function count(req, res, next) {
    _battle2.default.count({}, function (err, total) {
        if (err) {
            return res.json({ code: 400, message: "Internal server error" });
        }
        res.json({ code: 200, message: "Total battles fetched", data: total });
    });
};

/**
 * [searchBattle - get battels with king names]
 * @param  {object} req
 * @param  {object} res
 * @return {json}
 */
var searchBattle = exports.searchBattle = function searchBattle(req, res, next) {
    var inputData = req.query;
    var query = { $or: [{ 'attacker_king': inputData.king }, { 'defender_king': inputData.king }] };

    if (inputData.location) query.location = inputData.location;

    if (inputData.type) query.battle_type = inputData.type;

    _battle2.default.find(query, function (err, battles) {
        if (err) {
            return res.json({ code: 400, message: "Internal server error" });
        }
        res.json({ code: 200, message: "Battles fetched", data: battles });
    });
};

var add = exports.add = function add(req, res) {
    var filePath = '../battles.csv';
    (0, _csvtojson2.default)().fromFile(filePath).then(function (jsonObj) {
        console.log("jsonObj", jsonObj);
        if (jsonObj.length) {
            _async2.default.each(jsonObj, function (csvInfo, callback) {
                var battle_number = csvInfo.battle_number,
                    name = csvInfo.name,
                    year = csvInfo.year,
                    attacker_king = csvInfo.attacker_king,
                    defender_king = csvInfo.defender_king,
                    attackers = csvInfo.attackers,
                    defenders = csvInfo.defenders,
                    attacker_outcome = csvInfo.attacker_outcome,
                    battle_type = csvInfo.battle_type,
                    major_death = csvInfo.major_death,
                    major_capture = csvInfo.major_capture,
                    attacker_size = csvInfo.attacker_size,
                    defender_size = csvInfo.defender_size,
                    attacker_commander = csvInfo.attacker_commander,
                    defender_commande = csvInfo.defender_commande,
                    summer = csvInfo.summer,
                    location = csvInfo.location,
                    note = csvInfo.note,
                    region = csvInfo.region;

                var newBattle = new _battle2.default({
                    battle_number: battle_number,
                    name: name,
                    year: year,
                    attacker_king: attacker_king,
                    defender_king: defender_king,
                    attackers: attackers,
                    defenders: defenders,
                    attacker_outcome: attacker_outcome,
                    battle_type: battle_type,
                    major_death: major_death,
                    major_capture: major_capture,
                    attacker_size: attacker_size,
                    defender_size: defender_size,
                    attacker_commander: attacker_commander,
                    defender_commande: defender_commande,
                    summer: summer,
                    location: location,
                    note: note,
                    region: region
                });

                newBattle.save(function (err) {
                    if (err) {
                        console.log("err", err);
                        callback('Internal server error');
                    } else {
                        callback();
                    }
                });
            }, function (err) {
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
            });
        }
    });
};

var statistics = exports.statistics = function statistics(req, res, next) {
    var _req$query = req.query,
        text = _req$query.text,
        page = _req$query.page,
        limit = _req$query.limit,
        sort = _req$query.sort;

    var aggregate = [];

    if (typeof text !== "undefined") {
        aggregate.push({
            $match: {
                $or: [{ firstname: { $regex: text, $options: 'i' } }, { lastname: { $regex: text, $options: 'i' } }, { email: { $regex: text, $options: 'i' } }, { role: { $regex: text, $options: 'i' } }, { entryDate: { $regex: text, $options: 'i' } }]
            }
        });
    }

    if (typeof page !== "undefined" && typeof limit !== "undefined") {
        var skip = (page - 1) * limit;

        aggregate.push({ $skip: skip });
        aggregate.push({ $limit: parseInt(limit) });
    } else if (typeof limit !== "undefined") {

        aggregate.push({ $limit: parseInt(limit) });
    }

    if (typeof sort !== "undefined") {
        var order = sort.substring(0, 1) === '-' ? -1 : 1;
        var field = sort;

        if (field.charAt(0) === '-' || field.charAt(0) === '+') {
            field = field.substring(1);
        }

        field = field.replace(/^\s+|\s+$/g, '');

        aggregate.push({
            $sort: _defineProperty({}, field, order)
        });
    }

    // Default
    if (aggregate.length === 0) {
        aggregate.push({ $sort: { firstname: 1 } }); // Cambia dependiendo del Modelo
    }

    User.aggregate(aggregate, function (err, data) {
        if (err) {
            res.json({ error: true, data: err, message: "No se pudo obtener la información" });
        }

        res.json({ error: false, data: data, message: "No hay errores" });
    });
};