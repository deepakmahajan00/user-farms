import { Expose } from "class-transformer";

/**
 * @openapi
 * components:
 *  schemas:
 *    ListFarmDto:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        owner:
 *          type: string
 *        size:
 *          type: number
 *        yield:
 *          type: number
 *        address:
 *          type: object
 *        driving_distance:
 *          type: string
 */
export class ListFarmDto {
  constructor(partial?: Partial<ListFarmDto>[]) {
    Object.assign(this, partial);
  }

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public address: object | null;

  @Expose()
  public size: number;

  @Expose()
  public yield: number;

  @Expose()
  public street: string | null

  @Expose()
  public city: string | null

  @Expose()
  public country: string | null

  @Expose()
  public fc_latitude: string | null

  @Expose()
  public fc_longitude: string | null

  @Expose()
  public driving_distance: string;


  public static createFromEntity(farm: ListFarmDto[] | null): ListFarmDto | null {
    if (!farm) {
      return null;
    }
    
    const newListFarmDto = this.refactorData(farm);
    return new ListFarmDto({ ...newListFarmDto });
  }

  private static refactorData(farm: ListFarmDto[]) {
    let responseDto: { 
        name: string,
        owner: string,
        size: number,
        yield: number,
        address: object | null
        driving_distance: string,
    }[] = [];

    farm.forEach((data, index) => {
        responseDto[index] = {
            'name': data.name,
            'owner': data.email,
            'size': data.size,
            'yield': data.yield,
            'address': {
                'street': data.street,
                'city': data.city,
                'country': data.city,
                'latitude': data.fc_latitude,
                'longitude': data.fc_longitude
            },
            'driving_distance': data.driving_distance,
        }
    });
    return responseDto;
  }
}
