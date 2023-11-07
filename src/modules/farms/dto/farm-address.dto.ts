import { Address } from "../../addresses/entities/address.entity";
import { FarmCoordinateDto } from "modules/farms/dto/farm-coordinate.dto";
import { AddressDto } from "modules/addresses/dto/address.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    FarmAddressDto:
 *      type: object
 *      properties:
 *        street:
 *          type: string
 *        city:
 *          type: string
 *        country:
 *          type: string
 *        coordinate:
 *          type: FarmCoordinateDto
 */
export class FarmAddressDto extends AddressDto {
  public static createFromEntity(address: Address | null): FarmAddressDto | null {
    if (!address) {
      return null;
    }

    return new FarmAddressDto({  
        street: address.street,
        city: address.city,
        country: address.country,
        coordinate: FarmCoordinateDto.createFromEntity(address.coordinate)
    } );
  }
}
