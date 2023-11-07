import { IsNotEmpty, ValidateNested, IsString, IsDefined, IsNumber, IsEmail } from "class-validator";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateFarmDto:
 *      type: object
 *      required:
 *        - name
 *        - size
 *        - yield
 *        - address
 *        - user_email
 *      properties:
 *        name:
 *          type: string
 *          default: A Farm
 *        size:
 *          type: number
 *          default: 6.12
 *        yield:
 *          type: number
 *          default: 2.1
 *        email:
 *          type: string
 *          default: example@app.com
 *        address:
 *            $ref: '#/components/schemas/CreateAddressDto'
 */
export class CreateFarmDto {
    constructor(partial?: Partial<CreateFarmDto>) {
        Object.assign(this, partial);
      }

    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    @IsNotEmpty()
    public size: number;

    @IsNumber()
    @IsNotEmpty()
    public yield: number;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    @ValidateNested()
    @IsDefined()
    public address: CreateAddressDto;

    public static createFromEntity(farm: CreateFarmDto | null): CreateFarmDto | null {
        if (!farm) {
        return null;
        }

        return new CreateFarmDto({  
            name: farm.name,
            size: farm.size,
            yield: farm.yield,
        } );
    }
}
