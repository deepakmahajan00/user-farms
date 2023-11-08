import { IsNotEmpty, IsDecimal } from "class-validator";
import { Transform } from "class-transformer";
import { Coordinate } from "../entities/coordinate.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateCoordinateDto:
 *      type: object
 *      required:
 *        - latitude
 *        - longitude
 *      properties:
 *        latitude:
 *          type: decimal
 *          default: 21.234
 *        longitude:
 *          type: decimal
 *          default: 30.456
 */
export class CreateCoordinateDto {
  constructor(partial?: Partial<CreateCoordinateDto>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => (value as number))
  @IsNotEmpty()
  @IsDecimal()
  public latitude: number;

  @Transform(({ value }) => (value as number))
  @IsNotEmpty()
  @IsDecimal()
  public longitude: number;

  public static createFromEntity(coordinate: Coordinate | null): CreateCoordinateDto | null {
    if (!coordinate) {
      return null;
    }

    return new CreateCoordinateDto({ ...coordinate });
  }
}
