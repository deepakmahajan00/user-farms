import { Expose, Transform } from "class-transformer";
import { User } from "../../users/entities/user.entity";
import { AddressDto } from "modules/addresses/dto/address.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *    UserDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        email:
 *          type: string
 *        address:
 *          type: AddressDto
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export class UserDto {
  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public email: string;

  @Expose()
  public address: AddressDto;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  public static createFromEntity(user: User | null): UserDto | null {
    if (!user) {
      return null;
    }

    return new UserDto({ ...user });
  }
}
