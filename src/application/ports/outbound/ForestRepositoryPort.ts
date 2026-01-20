import Forest from "../../../domain/models/Forest";

export interface ForestRepositoryPort {
    create(forest: Forest): Promise<Forest>;
    get(id: string): Promise<Forest | null>;
    getAll(): Promise<Forest[]>;
    update(id: string, forest: Forest): Promise<Forest | null>;
    delete(id: string): Promise<boolean>;
    deforest(id: string): Promise<boolean>;
}
