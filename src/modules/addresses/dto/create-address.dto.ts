import { Expose } from "class-transformer";
import { Address } from "../entities/address.entity";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { IsObject, IsString, IsNotEmpty } from "class-validator";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateAddressDto:
 *      type: object
 *      required:
 *          - street
 *          - city
 *          - country
 *          - coordinate
 *      properties:
 *        street:
 *          type: string
 *          default: 'Street 1'
 *        city:
 *          type: string
 *          default: 'Copenhagen'
 *        country:
 *          type: string
 *          default: 'Denmark'
 *        coordinate:
 *          $ref: '#/components/schemas/CreateCoordinateDto'
 */
export class CreateAddressDto {
  constructor(partial?: Partial<CreateAddressDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  @Expose()
  public street: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  public city: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  public country: string;

  @IsObject()
  @IsNotEmpty()
  @Expose()
  public coordinate: CreateCoordinateDto;

  public static createFromEntity(address: Address | null): CreateAddressDto | null {
    if (!address) {
      return null;
    }

    return new CreateAddressDto({ ...address });
  }
}
