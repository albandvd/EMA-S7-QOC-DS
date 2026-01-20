import { Tree } from "../../../domain/models/Tree";

export interface TreeRepositoryPort {
  findAll(): Tree[];
  findById(uuid: string): Tree | null;
  insert(tree: Tree): Tree;
  update(uuid: string, tree: Tree): Tree | null;
  delete(uuid: string): boolean;
}