export type Place = {
  id: string;
  name: string;
};

export type PlaceId = Pick<Place, "id">;

export type ClubLocation = {
  id: string;
  city_id: string | null;
};
