// src/services/athlete.service.ts
import { SportsmenRepository } from '../repositories/sportsmen';

const repository = new SportsmenRepository();

export class SportsmenService {

   async getAllSportsmens() {
    return repository.findAll();
  }

  async getSportsmenById(id: string) {
    return repository.findById(id);
  }
  

}