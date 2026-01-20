import Forest from "../models/Forest";
import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";
import { NotFoundError } from "../errors/NotFoundError";
import { Species } from "../models/Species";

export class ForestService implements ForestServicePort {
    constructor(
        private readonly forestRepository: ForestRepositoryPort,
        private readonly treeRepository: TreeRepositoryPort
    ) {}

    async create(forest: Forest): Promise<Forest> {
        return this.forestRepository.create(forest);
    }

    async get(id: string): Promise<Forest | null> {
        const forest = await this.forestRepository.get(id);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }
        return forest;
    }

    async getAll(): Promise<Forest[]> {
        return this.forestRepository.getAll();
    }

    async update(id: string, forest: Forest): Promise<Forest | null> {
        return this.forestRepository.update(id, forest);
    }

    async delete(id: string): Promise<boolean> {
        return this.forestRepository.delete(id);
    }

    async getTreeSpecies(id: string): Promise<string[]> {
        const forest = await this.forestRepository.get(id);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }
        
        if (!forest.trees) {
            return [];
        }

        const species = forest.trees.map((tree) => Species[tree.species]);
        return [...new Set(species)];
    }

    async deforest(id: string, count: number): Promise<Forest | null> {
        const forest = await this.forestRepository.deforest(id, count);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }
        return forest;
    }

    async addTreeToForest(forestId: string, treeId: string): Promise<Forest | null> {
        const forest = await this.forestRepository.get(forestId);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }

        const tree = this.treeRepository.findById(treeId);
        if (!tree) {
            throw new NotFoundError("Tree not found");
        }

        if (!forest.trees) {
            forest.trees = [];
        }

        forest.trees.push(tree);
        return this.forestRepository.update(forestId, forest);
    }

    async removeTreeFromForest(forestId: string, treeId: string): Promise<Forest | null> {
        const forest = await this.forestRepository.get(forestId);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }

        if (!forest.trees) {
            throw new NotFoundError("Tree not found in forest");
        }

        const treeIndex = forest.trees.findIndex((tree) => tree.id === treeId);
        if (treeIndex === -1) {
            throw new NotFoundError("Tree not found in forest");
        }

        forest.trees.splice(treeIndex, 1);
        return this.forestRepository.update(forestId, forest);
    }
}
