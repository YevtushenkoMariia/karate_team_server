"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsmenService = void 0;
// src/services/athlete.service.ts
const sportsmen_1 = require("../repositories/sportsmen");
const repository = new sportsmen_1.SportsmenRepository();
class SportsmenService {
    async getAllSportsmens() {
        return repository.findAll();
    }
    async getSportsmenById(id) {
        return repository.findById(id);
    }
}
exports.SportsmenService = SportsmenService;
