import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateCoordinateDto } from "./dto/create-coordinate.dto";
import { Coordinate } from "./entities/coordinate.entity";
import dataSource from "orm/orm.config";

export class CoordinatesService {
  private readonly coordinatesRepository: Repository<Coordinate>;

  constructor() {
    this.coordinatesRepository = dataSource.getRepository(Coordinate);
  }

  public async createCoordinate(data: CreateCoordinateDto): Promise<Coordinate> {
    const { latitude, longitude } = data;
    const coordinateData: DeepPartial<Coordinate> = { latitude, longitude };

    const newCoordinate = this.coordinatesRepository.create(coordinateData);
    return this.coordinatesRepository.save(newCoordinate);
  }

  public async findOneBy(param: FindOptionsWhere<Coordinate>): Promise<Coordinate | null> {
    return this.coordinatesRepository.findOneBy({ ...param });
  }
}
