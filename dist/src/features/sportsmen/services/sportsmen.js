"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsmenService = void 0;
const repositories_1 = require("../repositories");
const repository = new repositories_1.SportsmenRepository();
class SportsmenService {
    async getAllSportsmens() {
        return repository.findAll();
    }
    async getSportsmenById(id) {
        return repository.findById(id);
    }
}
exports.SportsmenService = SportsmenService;
