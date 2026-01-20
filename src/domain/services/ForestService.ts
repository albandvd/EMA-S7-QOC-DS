import Forest from "../models/Forest";
import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import { NotFoundError } from "../errors/NotFoundError";
import { Species } from "../models/Species";

export class ForestService implements ForestServicePort {
    constructor(private readonly forestRepository: ForestRepositoryPort) {}

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
        const forest = await this.forestRepository.get(id);
        if (!forest) {
            throw new NotFoundError("Forest not found");
        }

        if (forest.trees.length < count) {
            throw new Error("Not enough trees to deforest");
        }

        forest.trees.splice(0, count);
        return this.forestRepository.update(id, forest);
    }
}
