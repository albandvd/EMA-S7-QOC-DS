import { Request, Response, Express } from "express";
import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";
import Forest from "../../domain/models/Forest";

export class ForestController {
    constructor(private readonly forestService: ForestServicePort) {}

    registerRoutes(app: Express) {
        app.post('/forest', this.create.bind(this));
        app.get('/forest/:id', this.get.bind(this));
        app.get('/forest', this.getAll.bind(this));
        app.put('/forest/:id', this.update.bind(this));
        app.delete('/forest/:id', this.delete.bind(this));
        app.get('/forest/:id/species', this.getTreeSpecies.bind(this));
        app.post('/forest/:id/deforest', this.deforest.bind(this));
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const forest = await this.forestService.create(req.body as Forest);
            res.status(201).json(forest);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const forest = await this.forestService.get(req.params.id);
            if (forest) {
                res.status(200).json(forest);
            } else {
                res.status(404).send();
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const forests = await this.forestService.getAll();
            res.status(200).json(forests);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const forest = await this.forestService.update(req.params.id, req.body as Forest);
            if (forest) {
                res.status(200).json(forest);
            } else {
                res.status(404).send();
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const success = await this.forestService.delete(req.params.id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).send();
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    
    async getTreeSpecies(req: Request, res: Response): Promise<void> {
        try {
            const species = await this.forestService.getTreeSpecies(req.params.id);
            res.status(200).json(species);
        } catch (error) {
            if ((error as Error).message === "Forest not found") {
                res.status(404).json({ error: (error as Error).message });
            } else {
                res.status(500).json({ error: (error as Error).message });
            }
        }
    }

    async deforest(req: Request, res: Response): Promise<void> {
        try {
            const { count } = req.body;
            const forest = await this.forestService.deforest(req.params.id, count);
            res.status(200).json(forest);
        } catch (error) {
            if ((error as Error).message === "Forest not found") {
                res.status(404).json({ error: (error as Error).message });
            } else if ((error as Error).message === "Not enough trees to deforest") {
                res.status(400).json({ error: (error as Error).message });
            } else {
                res.status(500).json({ error: (error as Error).message });
            }
        }
    }
}
