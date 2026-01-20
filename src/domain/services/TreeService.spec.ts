import { Tree } from "../models/Tree";
import { Species } from "../models/Species";
import { Exposure } from "../models/Exposure";
import { TreeService } from "./TreeService";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";

const mockTreeRepository: jest.Mocked<TreeRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("TreeService", () => {
  let treeService: TreeService;

  beforeEach(() => {
    treeService = new TreeService(mockTreeRepository);
    jest.clearAllMocks();
  });

  it("should get a tree by uuid", async () => {
    const tree = new Tree(
      new Date("2020-01-01"),
      Species.OAK,
      Exposure.SUNNY,
      100,
      "1"
    );
    mockTreeRepository.findById.mockReturnValue(tree);

    const result = treeService.get("1");

    expect(result).toEqual(tree);
    expect(mockTreeRepository.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when getting a non-existent tree", async () => {
    mockTreeRepository.findById.mockReturnValue(null);

    const result = treeService.get("non-existent");

    expect(result).toBeNull();
    expect(mockTreeRepository.findById).toHaveBeenCalledWith("non-existent");
  });

  it("should get all trees", async () => {
    const trees = [
      new Tree(
        new Date("2020-01-01"),
        Species.OAK,
        Exposure.SUNNY,
        100,
        "1"
      ),
      new Tree(
        new Date("2019-05-15"),
        Species.ASH,
        Exposure.MID_SHADOW,
        150,
        "2"
      ),
    ];
    mockTreeRepository.findAll.mockReturnValue(trees);

    const result = treeService.list();

    expect(result).toEqual(trees);
    expect(mockTreeRepository.findAll).toHaveBeenCalled();
  });

  it("should save a tree", async () => {
    const tree = new Tree(
      new Date("2021-01-01"),
      Species.FIR,
      Exposure.SHADOW,
      120
    );
    mockTreeRepository.insert.mockReturnValue({ ...tree, id: "3" });

    const result = treeService.save(tree);

    expect(result).toEqual({ ...tree, id: "3" });
    expect(mockTreeRepository.insert).toHaveBeenCalledWith(tree);
  });

  it("should throw an error if birth date is null when saving a tree", () => {
    const tree = new Tree(null as any, Species.FIR, Exposure.SHADOW, 120);
    expect(() => treeService.save(tree)).toThrow(
      "Tree birth date cannot be null"
    );
  });

  it("should update a tree", async () => {
    const existingTree = new Tree(
      new Date("2020-01-01"),
      Species.OAK,
      Exposure.SUNNY,
      100,
      "1"
    );
    const updatedTreeData = new Tree(
      new Date("2020-01-01"),
      Species.OAK,
      Exposure.SUNNY,
      150,
      "1"
    );
    mockTreeRepository.findById.mockReturnValue(existingTree);
    mockTreeRepository.update.mockReturnValue(updatedTreeData);

    const result = treeService.update("1", updatedTreeData);

    expect(result).toEqual(updatedTreeData);
    expect(mockTreeRepository.findById).toHaveBeenCalledWith("1");
    expect(mockTreeRepository.update).toHaveBeenCalledWith("1", updatedTreeData);
  });

  it("should return null when updating a non-existent tree", () => {
    const updatedTreeData = new Tree(
      new Date("2020-01-01"),
      Species.OAK,
      Exposure.SUNNY,
      150,
      "1"
    );
    mockTreeRepository.findById.mockReturnValue(null);

    const result = treeService.update("1", updatedTreeData);

    expect(result).toBeNull();
    expect(mockTreeRepository.findById).toHaveBeenCalledWith("1");
    expect(mockTreeRepository.update).not.toHaveBeenCalled();
  });

  it("should delete a tree", async () => {
    mockTreeRepository.delete.mockReturnValue(true);

    const result = treeService.delete("1");

    expect(result).toBe(true);
    expect(mockTreeRepository.delete).toHaveBeenCalledWith("1");
  });
});