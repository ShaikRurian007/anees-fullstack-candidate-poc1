"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CandidateSchema = new mongoose_1.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: Number, required: true },
    skills: { type: [String], default: [] },
}, { timestamps: true });
