import Forest from "../../../domain/models/Forest";

export interface ForestServicePort {
    create(forest: Forest): Promise<Forest>;
    get(id: string): Promise<Forest | null>;
    getAll(): Promise<Forest[]>;
    update(id: string, forest: Forest): Promise<Forest | null>;
    delete(id: string): Promise<boolean>;
    getTreeSpecies(id: string): Promise<string[]>;
}
