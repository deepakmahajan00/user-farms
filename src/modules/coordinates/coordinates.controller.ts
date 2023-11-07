import { NextFunction, Request, Response } from "express";
import { CoordinateDto } from "./dto/coordinate.dto";
import { CreateCoordinateDto } from "./dto/create-coordinate.dto";
import { CoordinatesService } from "./coordinates.service";

export class CoordinatesController {
  private readonly coordinatesService: CoordinatesService;

  constructor() {
    this.coordinatesService = new CoordinatesService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude } = req.body;
      const existingCoordinate = await this.coordinatesService.findOneBy({ latitude, longitude });
      if (existingCoordinate) {
        res.status(201).send({message: "Coordinates already exists!"});
      }
      const coordinate = await this.coordinatesService.createCoordinate(req.body as CreateCoordinateDto);
      res.status(201).send(CoordinateDto.createFromEntity(coordinate));
    } catch (error) {
      next(error);
    }
  }
}
