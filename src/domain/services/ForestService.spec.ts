import { ForestService } from "./ForestService";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";
import Forest from "../models/Forest";
import { Tree } from "../models/Tree";
import { Species } from "../models/Species";
import { Exposure } from "../models/Exposure";
import { ForestType } from "../models/ForestType";
import { NotFoundError } from "../errors/NotFoundError";

const mockForestRepository: jest.Mocked<ForestRepositoryPort> = {
    create: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deforest: jest.fn(),
};

const mockTreeRepository: jest.Mocked<TreeRepositoryPort> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("ForestService", () => {
    let forestService: ForestService;

    beforeEach(() => {
        forestService = new ForestService(mockForestRepository, mockTreeRepository);
        jest.clearAllMocks();
    });

    it("should create a forest", async () => {
        const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
        mockForestRepository.create.mockResolvedValue(forest);

        const result = await forestService.create(forest);

        expect(result).toEqual(forest);
        expect(mockForestRepository.create).toHaveBeenCalledWith(forest);
    });

    it("should get a forest", async () => {
        const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
        mockForestRepository.get.mockResolvedValue(forest);

        const result = await forestService.get("forest1");

        expect(result).toEqual(forest);
        expect(mockForestRepository.get).toHaveBeenCalledWith("forest1");
    });

    it("should throw NotFoundError when getting a non-existent forest", async () => {
        mockForestRepository.get.mockResolvedValue(null);
        await expect(forestService.get("non-existent")).rejects.toThrow(NotFoundError);
    });

    it("should get all forests", async () => {
        const forests = [
            new Forest("forest1", ForestType.TEMPERATE, [], 45),
            new Forest("forest2", ForestType.BOREAL, [], 60),
        ];
        mockForestRepository.getAll.mockResolvedValue(forests);

        const result = await forestService.getAll();

        expect(result).toEqual(forests);
        expect(mockForestRepository.getAll).toHaveBeenCalled();
    });

    it("should update a forest", async () => {
        const forest = new Forest("forest1", ForestType.TROPICAL, [], 50);
        mockForestRepository.update.mockResolvedValue(forest);

        const result = await forestService.update("forest1", forest);

        expect(result).toEqual(forest);
        expect(mockForestRepository.update).toHaveBeenCalledWith("forest1", forest);
    });

    it("should delete a forest", async () => {
        mockForestRepository.delete.mockResolvedValue(true);

        const result = await forestService.delete("forest1");

        expect(result).toBe(true);
        expect(mockForestRepository.delete).toHaveBeenCalledWith("forest1");
    });

    it("should get tree species of a forest", async () => {
        const trees: Tree[] = [
            new Tree(new Date(), Species.OAK, Exposure.SUNNY, 10),
            new Tree(new Date(), Species.FIR, Exposure.SHADOW, 20),
            new Tree(new Date(), Species.OAK, Exposure.SUNNY, 15),
        ];
        const forest = new Forest("forest1", ForestType.TEMPERATE, trees, 45);
        mockForestRepository.get.mockResolvedValue(forest);

        const result = await forestService.getTreeSpecies("forest1");

        expect(result).toEqual(["OAK", "FIR"]);
        expect(mockForestRepository.get).toHaveBeenCalledWith("forest1");
    });

    it("should return empty array for tree species if forest has no trees", async () => {
        const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
        mockForestRepository.get.mockResolvedValue(forest);

        const result = await forestService.getTreeSpecies("forest1");

        expect(result).toEqual([]);
        expect(mockForestRepository.get).toHaveBeenCalledWith("forest1");
    });

    it("should throw NotFoundError when getting tree species of a non-existent forest", async () => {
        mockForestRepository.get.mockResolvedValue(null);
        await expect(forestService.getTreeSpecies("non-existent")).rejects.toThrow(NotFoundError);
    });

    describe("deforest", () => {
        it("should deforest a forest", async () => {
            const trees: Tree[] = [
                new Tree(new Date(), Species.OAK, Exposure.SUNNY, 10),
                new Tree(new Date(), Species.FIR, Exposure.SHADOW, 20),
                new Tree(new Date(), Species.OAK, Exposure.SUNNY, 15),
            ];
            const updatedForest = new Forest("forest1", ForestType.TEMPERATE, [trees[2]], 45);
            mockForestRepository.deforest.mockResolvedValue(updatedForest);

            const result = await forestService.deforest("forest1", 2);

            expect(result).toEqual(updatedForest);
            expect(mockForestRepository.deforest).toHaveBeenCalledWith("forest1", 2);
        });

        it("should throw NotFoundError when deforesting a non-existent forest", async () => {
            mockForestRepository.deforest.mockResolvedValue(null);
            await expect(forestService.deforest("non-existent", 1)).rejects.toThrow(NotFoundError);
        });

        it("should throw an error when there are not enough trees to deforest", async () => {
            mockForestRepository.deforest.mockRejectedValue(new Error("Not enough trees to deforest"));
            await expect(forestService.deforest("forest1", 2)).rejects.toThrow("Not enough trees to deforest");
        });
    });

    describe("addTreeToForest", () => {
        it("should add a tree to a forest", async () => {
            const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
            const tree = new Tree(new Date(), Species.OAK, Exposure.SUNNY, 10, "tree1");
            const updatedForest = new Forest("forest1", ForestType.TEMPERATE, [tree], 45);

            mockForestRepository.get.mockResolvedValue(forest);
            mockTreeRepository.findById.mockReturnValue(tree);
            mockForestRepository.update.mockResolvedValue(updatedForest);

            const result = await forestService.addTreeToForest("forest1", "tree1");

            expect(result).toEqual(updatedForest);
            expect(mockForestRepository.get).toHaveBeenCalledWith("forest1");
            expect(mockTreeRepository.findById).toHaveBeenCalledWith("tree1");
            expect(mockForestRepository.update).toHaveBeenCalledWith("forest1", forest);
        });

        it("should throw NotFoundError if forest is not found", async () => {
            mockForestRepository.get.mockResolvedValue(null);
            await expect(forestService.addTreeToForest("non-existent", "tree1")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError if tree is not found", async () => {
            const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
            mockForestRepository.get.mockResolvedValue(forest);
            mockTreeRepository.findById.mockReturnValue(null);

            await expect(forestService.addTreeToForest("forest1", "non-existent")).rejects.toThrow(NotFoundError);
        });
    });

    describe("removeTreeFromForest", () => {
        const tree1 = new Tree(new Date(), Species.OAK, Exposure.SUNNY, 10, "tree1");
        const tree2 = new Tree(new Date(), Species.FIR, Exposure.SHADOW, 20, "tree2");

        it("should remove a tree from a forest", async () => {
            const forest = new Forest("forest1", ForestType.TEMPERATE, [tree1, tree2], 45);
            const updatedForest = new Forest("forest1", ForestType.TEMPERATE, [tree2], 45);
            mockForestRepository.get.mockResolvedValue(forest);
            mockForestRepository.update.mockResolvedValue(updatedForest);

            const result = await forestService.removeTreeFromForest("forest1", "tree1");

            expect(result).toEqual(updatedForest);
            expect(mockForestRepository.get).toHaveBeenCalledWith("forest1");
            expect(mockForestRepository.update).toHaveBeenCalledWith("forest1", expect.any(Forest));
        });

        it("should throw NotFoundError if forest is not found", async () => {
            mockForestRepository.get.mockResolvedValue(null);
            await expect(forestService.removeTreeFromForest("non-existent", "tree1")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError if forest has no trees", async () => {
            const forest = new Forest("forest1", ForestType.TEMPERATE, [], 45);
            mockForestRepository.get.mockResolvedValue(forest);
            await expect(forestService.removeTreeFromForest("forest1", "tree1")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError if tree is not in the forest", async () => {
            const forest = new Forest("forest1", ForestType.TEMPERATE, [tree2], 45);
            mockForestRepository.get.mockResolvedValue(forest);
            await expect(forestService.removeTreeFromForest("forest1", "tree1")).rejects.toThrow(NotFoundError);
        });
    });
});
