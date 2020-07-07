"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston_1 = require("winston");
var path_1 = __importDefault(require("path"));
var logLevel = process.env.LOGGING_LEVEL || 'debug';
var logDir = process.env.LOG_DIRECTORY || 'log';
var filename = path_1.default.join(logDir, 'results.log');
var logConfig = {
    file: {
        level: logLevel,
        format: winston_1.format.combine(winston_1.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), winston_1.format.splat(), winston_1.format.json()),
        filename: filename
    },
    console: {
        level: 'info',
        format: winston_1.format.combine(winston_1.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), winston_1.format.colorize(), winston_1.format.simple()),
    }
};
exports.logger = winston_1.createLogger({
    transports: [
        new winston_1.transports.File(logConfig.file),
        new winston_1.transports.Console(logConfig.console)
    ],
    exitOnError: false
});
