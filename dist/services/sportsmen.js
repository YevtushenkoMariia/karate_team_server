"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteService = void 0;
// src/services/athlete.service.ts
const sportsmen_1 = require("../repositories/sportsmen");
const repository = new sportsmen_1.AthleteRepository();
class AthleteService {
    async getAllAthletes() {
        return repository.findAll();
    }
    async getAthleteById(id) {
        return repository.findById(id);
    }
}
exports.AthleteService = AthleteService;
