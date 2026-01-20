import { Species } from "./Species";
import { Exposure } from "./Exposure";

export class Tree {
  id?: string;
  birth: Date;
  species: Species;
  exposure: Exposure;
  carbonStorageCapacity: number; // Between 10 and 50 kg/year

  constructor(
    birth: Date,
    species: Species,
    exposure: Exposure,
    carbonStorageCapacity: number,
    id?: string
  ) {
    this.birth = birth;
    this.species = species;
    this.exposure = exposure;
    this.carbonStorageCapacity = carbonStorageCapacity;
    this.id = id;
  }
}