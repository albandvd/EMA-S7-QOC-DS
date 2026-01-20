import { CO2AbsorptionServicePort } from "../../application/ports/inbound/CO2AbsorptionServicePort";
import Forest from "../models/Forest";

export class CO2AbsorptionService implements CO2AbsorptionServicePort {
  private readonly AVERAGE_ABSORPTION_PER_HECTARE = 10000;

  getAbsorption(forest: Forest): number {
    if (!forest.trees || forest.trees.length === 0) {
      return 0;
    }

    const totalAbsorption = forest.trees.reduce((acc, tree) => acc + tree.carbonStorageCapacity, 0);
    const uniqueSpecies = new Set(forest.trees.map(tree => tree.species));
    const diversity = uniqueSpecies.size / forest.trees.length;

    return totalAbsorption * (1 + diversity);
  }

  calculateRequiredForestArea(co2Amount: number): number {
    return co2Amount / this.AVERAGE_ABSORPTION_PER_HECTARE;
  }
}
