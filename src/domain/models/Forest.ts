import { ForestType } from "./ForestType";
import { Tree } from "./Tree";

export default class Forest {
  constructor(
    public id: string,
    public type: ForestType,
    public trees: Tree[],
    public surface: number
  ) {}
}