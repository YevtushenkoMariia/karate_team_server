export type FindOrCreateCityRequest = {
  cityName: string;
};

export type FindOrCreateClubRequest = {
  clubName: string;
  cityId: string | null;
};
