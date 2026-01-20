import { Tree } from "../../domain/models/Tree";
import { v4 as uuidv4 } from "uuid";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";

export class TreeRepositoryAdapter implements TreeRepositoryPort {
  trees: Tree[] = [];

  findAll(): Tree[] {
    return this.trees;
  }

  findById(uuid: string): Tree | null {
    return this.trees.find((tree) => tree.id === uuid) || null;
  }

  insert(tree: Tree): Tree {
    const newTree = new Tree(
      tree.birth,
      tree.species,
      tree.exposure,
      tree.carbonStorageCapacity,
      uuidv4()
    );
    this.trees.push(newTree);
    return newTree;
  }

  update(uuid: string, tree: Tree): Tree | null {
    const index = this.trees.findIndex((t) => t.id === uuid);
    if (index === -1) {
      return null;
    }
    const existingTree = this.trees[index];
    existingTree.birth = tree.birth;
    existingTree.species = tree.species;
    existingTree.exposure = tree.exposure;
    existingTree.carbonStorageCapacity = tree.carbonStorageCapacity;
    return existingTree;
  }

  delete(uuid: string): boolean {
    const index = this.trees.findIndex((t) => t.id === uuid);
    if (index === -1) {
      return false;
    }
    this.trees.splice(index, 1);
    return true;
  }
}