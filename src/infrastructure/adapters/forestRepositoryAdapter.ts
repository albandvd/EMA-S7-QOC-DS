import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import Forest from "../../domain/models/Forest";
import { v4 as uuidv4 } from "uuid";

export class ForestRepositoryAdapter implements ForestRepositoryPort {
  private forests: Forest[] = [];

  async create(forest: Forest): Promise<Forest> {
    const newForest = new Forest(
      uuidv4(),
      forest.type,
      forest.trees,
      forest.surface
    );
    this.forests.push(newForest);
    return newForest;
  }

  async get(id: string): Promise<Forest | null> {
    return this.forests.find((forest) => forest.id === id) || null;
  }

  async getAll(): Promise<Forest[]> {
    return this.forests;
  }

  async update(id: string, forest: Forest): Promise<Forest | null> {
    const index = this.forests.findIndex((f) => f.id === id);
    if (index === -1) {
      return null;
    }
    const existingForest = this.forests[index];
    existingForest.type = forest.type;
    existingForest.trees = forest.trees;
    existingForest.surface = forest.surface;
    return existingForest;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.forests.findIndex((f) => f.id === id);
    if (index === -1) {
      return false;
    }
    this.forests.splice(index, 1);
    return true;
  }

  async deforest(id: string, count: number): Promise<Forest | null> {
    const index = this.forests.findIndex((f) => f.id === id);
    if (index === -1) {
      return null;
    }
    const forest = this.forests[index];

    if (forest.trees.length < count) {
      throw new Error("Not enough trees to deforest");
    }

    forest.trees.splice(0, count);
    return forest;
  }
}
