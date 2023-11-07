import { Expose, Transform } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { FarmAddressDto } from "modules/farms/dto/farm-address.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    FarmDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 *        owner:
 *          type: string
 *        address:
 *          type: object
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export class FarmDto {
  constructor(partial?: Partial<FarmDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public name: string;

  @Expose()
  public owner: string;

  @Expose()
  public size: number;

  @Expose()
  public farm_yield: number;

  @Expose()
  public address: FarmAddressDto | null

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  public static createFromEntity(farm: Farm | null): FarmDto | null {
    if (!farm) {
      return null;
    }
    return new FarmDto({ ...farm });
  }
}
