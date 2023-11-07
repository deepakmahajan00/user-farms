import { Expose, Transform } from "class-transformer";
import { Address } from "../entities/address.entity";
import { CoordinateDto } from "modules/coordinates/dto/coordinate.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    AddressDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        street:
 *          type: string
 *        city:
 *          type: string
 *        country:
 *          type: string
 *        coordinate:
 *          type: CoordinateDto
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export class AddressDto {
  constructor(partial?: Partial<AddressDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public street: string;

  @Expose()
  public city: string;

  @Expose()
  public country: string;

  @Expose()
  public coordinate: CoordinateDto | null;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  public static createFromEntity(address: Address | null): AddressDto | null {
    if (!address) {
      return null;
    }

    return new AddressDto({ ...address });
  }
}
