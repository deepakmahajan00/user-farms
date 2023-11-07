import { CoordinateDto } from "modules/coordinates/dto/coordinate.dto";
import { Coordinate } from "../../coordinates/entities/coordinate.entity";

/**
 * @openapi
 * components:
 *  schemas:
 *    FarmCoordinateDto:
 *      type: object
 *      properties:
 *        latitude:
 *          type: number
 *        longitude:
 *          type: string
 */
export class FarmCoordinateDto extends CoordinateDto {
  public static createFromEntity(coordinate: Coordinate | null): FarmCoordinateDto | null {
    if (!coordinate) {
      return null;
    }

    return new CoordinateDto({  
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
    } );
  }
}
