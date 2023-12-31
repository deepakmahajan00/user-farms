import { NextFunction, Response, Request } from "express";
import { FarmDto } from "./dto/farm.dto";
import { FarmsService } from "./farms.service";
import { ListFarmDto } from "./dto/list-farm.dto";
import { CreateFarmDto } from "./dto/create-farm.dto";

export class FarmsController {
  private readonly farmsService: FarmsService;
  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const farm = await this.farmsService.createFarm(req.body as CreateFarmDto);
      res.status(201).send(FarmDto.createFromEntity(farm));
    } catch (error) {
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = require("url").parse(req.url, true).query;
      const outlierCondition = await this.getOutlier(query.outliers);
      const farm = await this.farmsService.fetchAllFarms(query.sort, outlierCondition, query.page, query.pageSize);
      const listFarmDto = ListFarmDto.createFromEntity(farm);
      res.status(200).send(listFarmDto);
    } catch (error) {
      next(error);
    }
  }

  private async getOutlier(outlier: any): Promise<boolean> {
    return (outlier == "false") ? false : true;
  }
}
