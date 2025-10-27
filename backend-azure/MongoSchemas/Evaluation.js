"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EvaluationSchema = new mongoose_1.Schema({
    candidateId: { type: String, index: true },
    scored: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
