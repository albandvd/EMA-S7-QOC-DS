import { CO2AbsorptionService } from "./CO2AbsorptionService";
import Forest from "../models/Forest";
import { Tree } from "../models/Tree";
import { Species } from "../models/Species";
import { Exposure } from "../models/Exposure";
import { ForestType } from "../models/ForestType";

describe("CO2AbsorptionService", () => {
  let co2AbsorptionService: CO2AbsorptionService;

  beforeEach(() => {
    co2AbsorptionService = new CO2AbsorptionService();
  });

  describe("getAbsorption", () => {
    it("should return 0 for a forest with no trees", () => {
      const forest = new Forest("1", ForestType.BOREAL, [], 100);
      expect(co2AbsorptionService.getAbsorption(forest)).toBe(0);
    });

    it("should calculate absorption for a forest with one tree", () => {
      const tree = new Tree(new Date(), Species.OAK, Exposure.SUNNY, 100, "1");
      const forest = new Forest("1", ForestType.BOREAL, [tree], 100);
      // diversity = 1 / 1 = 1. absorption = 100 * (1 + 1) = 200
      expect(co2AbsorptionService.getAbsorption(forest)).toBe(200);
    });

    it("should calculate absorption for a forest with multiple trees of the same species", () => {
      const trees = [
        new Tree(new Date(), Species.OAK, Exposure.SUNNY, 100, "1"),
        new Tree(new Date(), Species.OAK, Exposure.SUNNY, 150, "2"),
      ];
      const forest = new Forest("1", ForestType.BOREAL, trees, 100);
      // totalAbsorption = 250. diversity = 1 / 2 = 0.5. absorption = 250 * (1 + 0.5) = 375
      expect(co2AbsorptionService.getAbsorption(forest)).toBe(375);
    });

    it("should calculate absorption for a forest with multiple trees of different species", () => {
      const trees = [
        new Tree(new Date(), Species.OAK, Exposure.SUNNY, 100, "1"),
        new Tree(new Date(), Species.FIR, Exposure.SHADOW, 150, "2"),
        new Tree(new Date(), Species.ASH, Exposure.MID_SHADOW, 200, "3"),
      ];
      const forest = new Forest("1", ForestType.BOREAL, trees, 100);
      // totalAbsorption = 450. diversity = 3 / 3 = 1. absorption = 450 * (1 + 1) = 900
      expect(co2AbsorptionService.getAbsorption(forest)).toBe(900);
    });
  });

  describe("calculateRequiredForestArea", () => {
    it("should calculate the required forest area to absorb a given amount of CO2", () => {
      const co2Amount = 25000;
      // required area = 25000 / 10000 = 2.5
      expect(co2AbsorptionService.calculateRequiredForestArea(co2Amount)).toBe(2.5);
    });
  });
});
