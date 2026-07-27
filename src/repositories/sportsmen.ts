import { prisma } from '../lib/prisma';

export class SportsmenRepository {
  async findAll() {
    return prisma.sportsmen.findMany({
      
    });
  }

  async findById(id: number) {
    return prisma.sportsmen.findUnique({
      where: { user_id: id },
    });
  }

 
}