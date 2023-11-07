import { Expose, Transform } from "class-transformer";
import { Coordinate } from "../entities/coordinate.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    CoordinateDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        latitude:
 *          type: number
 *        longitude:
 *          type: number
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export class CoordinateDto {
  constructor(partial?: Partial<CoordinateDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  public static createFromEntity(coordinate: Coordinate | null): CoordinateDto | null {
    if (!coordinate) {
      return null;
    }

    return new CoordinateDto({ ...coordinate });
  }
}
