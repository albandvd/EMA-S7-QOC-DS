import Forest from "../../../domain/models/Forest";

export interface ForestServicePort {
    create(forest: Forest): Promise<Forest>;
    get(id: string): Promise<Forest | null>;
    getAll(): Promise<Forest[]>;
    update(id: string, forest: Forest): Promise<Forest | null>;
    delete(id: string): Promise<boolean>;
    getTreeSpecies(id: string): Promise<string[]>;
    deforest(id: string, count: number): Promise<Forest | null>;
    addTreeToForest(forestId: string, treeId: string): Promise<Forest | null>;
    removeTreeFromForest(forestId: string, treeId: string): Promise<Forest | null>;
}
