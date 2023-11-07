import { IsEmail, IsNotEmpty, ValidateNested, IsString, IsDefined } from "class-validator";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserDto:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - address
 *      properties:
 *        email:
 *          type: string
 *          default: example@app.com
 *        password:
 *          type: string
 *          default: password
 *        address:
 *            $ref: '#/components/schemas/CreateAddressDto'
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  @ValidateNested()
  @IsDefined()
  public address: CreateAddressDto;
}
