import { IsNotEmpty, IsDecimal } from "class-validator";
import { Transform } from "class-transformer";

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
  @Transform(({ value }) => (value as number))
  @IsNotEmpty()
  @IsDecimal()
  public latitude: number;

  @IsNotEmpty()
  @IsDecimal()
  public longitude: number;
}
