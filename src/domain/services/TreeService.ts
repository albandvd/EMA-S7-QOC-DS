import { TreeServicePort } from "../../application/ports/inbound/TreeServicePort";
import { Tree } from "../models/Tree";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";
import { NotFoundError } from "../errors/NotFoundError";

export class TreeService implements TreeServicePort {
  constructor(private readonly repo: TreeRepositoryPort) {}

  get(uuid: string): Tree | null {
    const tree = this.repo.findById(uuid);
    if (!tree) {
      return null;
    }
    return tree;
  }

  list(): Tree[] {
    return this.repo.findAll();
  }

  save(tree: Tree): Tree {
    if (tree.birth === null) {
      throw new Error("Tree birth date cannot be null");
    }

    // Some other validation rules could be defined here

    return this.repo.insert(tree);
  }

  update(uuid: string, tree: Tree): Tree | null {
    const existingTree = this.repo.findById(uuid);
    if (!existingTree) {
      return null;
    }
    return this.repo.update(uuid, tree);
  }

  delete(uuid: string): boolean {
    return this.repo.delete(uuid);
  }
}