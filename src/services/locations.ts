import { LocationRepository } from "../repositories/locations";
import { AppError } from "../types/error";

const repository = new LocationRepository();

export class LocationService {

    async getCities() {
        const cities = await repository.getAllCities();

        if(!cities){
            throw new AppError("Cities not found", 404);
        }
        return cities;
    }

    async getClubs() {
        const clubs = await repository.getAllClubs();

        if(!clubs){
            throw new AppError("Clubs not found", 404);
        }
        return clubs;
    }
}