import { TreeServicePort } from "../../application/ports/inbound/TreeServicePort";
import { Express, Response, Request } from "express";
import { Tree } from "../../domain/models/Tree";

export class TreeController {
  constructor(private treeService: TreeServicePort) {}

  registerRoutes(app: Express) {
    app.post('/tree', this.create.bind(this));
    app.get('/tree', this.listAllTrees.bind(this));
    app.get('/tree/:uuid', this.getTreeById.bind(this));
    app.put('/tree/:uuid', this.update.bind(this));
    app.delete('/tree/:uuid', this.delete.bind(this));
  }

  async create(req: Request, res: Response) {
    try {
      const tree = await this.treeService.save(req.body as Tree);
      res.status(201).json(tree);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async listAllTrees(req: Request, res: Response) {
    const trees = await this.treeService.list();
    res.status(200).send(trees);
  }

  async getTreeById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const tree = await this.treeService.get(uuid);
    if (tree) {
      res.status(200).send(tree);
    } else {
      res.status(404).send({ message: "Tree not found" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const uuid: string = req.params.uuid;
      const tree = await this.treeService.update(uuid, req.body as Tree);
      if (tree) {
        res.status(200).json(tree);
      } else {
        res.status(404).send({ message: "Tree not found" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const uuid: string = req.params.uuid;
      const success = await this.treeService.delete(uuid);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).send({ message: "Tree not found" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}