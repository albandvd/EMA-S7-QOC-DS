import { Request, Response, Express } from "express";
import { CO2AbsorptionServicePort } from "../../application/ports/inbound/CO2AbsorptionServicePort";
import { ForestServicePort } from "../../application/ports/inbound/ForestServicePort";

export class CO2Controller {
    constructor(
        private readonly co2AbsorptionService: CO2AbsorptionServicePort,
        private readonly forestService: ForestServicePort
    ) {}

    registerRoutes(app: Express) {
        app.get('/co2/forest/:id/absorption', this.getForestAbsorption.bind(this));
        app.get('/co2/required-area', this.getRequiredArea.bind(this));
    }

    async getForestAbsorption(req: Request, res: Response): Promise<void> {
        try {
            const forest = await this.forestService.get(req.params.id);
            if (!forest) {
                res.status(404).send({ message: "Forest not found" });
                return;
            }
            const absorption = this.co2AbsorptionService.getAbsorption(forest);
            res.status(200).json({ absorption });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getRequiredArea(req: Request, res: Response): Promise<void> {
        try {
            const co2Amount = Number(req.query.co2Amount);
            if (isNaN(co2Amount)) {
                res.status(400).send({ message: "co2Amount must be a number" });
                return;
            }
            const requiredArea = this.co2AbsorptionService.calculateRequiredForestArea(co2Amount);
            res.status(200).json({ requiredArea });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
