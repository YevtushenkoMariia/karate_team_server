import { LocationRepository } from "../repositories/locations";

const repository = new LocationRepository();

export class LocationService {

    async getCities() {
        const cities = await repository.getAllCities();
        return cities;
    }

    async getClubs() {
        const clubs = await repository.getAllClubs();
        return clubs;
    }
}