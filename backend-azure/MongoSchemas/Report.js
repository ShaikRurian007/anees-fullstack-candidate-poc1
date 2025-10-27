"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ReportSchema = new mongoose_1.Schema({
    candidateId: { type: String, index: true },
    candidate: { type: mongoose_1.Schema.Types.Mixed },
    scored: { type: mongoose_1.Schema.Types.Mixed },
    feedback: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
