"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = require("./users");
var logger_1 = require("./utils/logger");
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.send({ response: "Server is up and running." }).status(200);
});
router.post("/register", function (req, res) {
    var name = req.body.name;
    var nameValid = users_1.validateName(name);
    var doesNameExist = users_1.nameExists(name);
    logger_1.logger.info('RECIEVED A POST REQUEST FROM /register', req.body);
    if (!nameValid || doesNameExist) {
        res.send({ error: 'Nickname taken, please try another' });
    }
    else {
        res.send({ name: name, error: false });
    }
});
exports.default = router;
