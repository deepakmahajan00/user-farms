import { DeepPartial, Repository } from "typeorm";
import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import axios from 'axios';
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UnprocessableEntityError } from "errors/errors";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { AddressesService } from "modules/addresses/addresses.service";
import { CoordinatesService } from "modules/coordinates/coordinates.service";
import { Address } from "modules/addresses/entities/address.entity";
import { Coordinate } from "modules/coordinates/entities/coordinate.entity";
import { UsersService } from "modules/users/users.service";
import { ListFarmDto } from "./dto/list-farm.dto";
import config from "config/config";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly addressesService: AddressesService;
  private readonly coordinatesService: CoordinatesService;
  private readonly usersService: UsersService;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.addressesService = new AddressesService();
    this.coordinatesService = new CoordinatesService();
    this.usersService = new UsersService();
  }

  public async fetchAllFarms(
    sortBy: string = 'name',
    outlierCondition: boolean = true,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ListFarmDto[] | []> 
  {
    const farms = await this.findAll(
      sortBy, 
      outlierCondition ? true : false,
      page,
      pageSize
    );
    return farms;
  }
  
  public async findAll(sortBy: string, outlierCondition: true | false, page: number = 1, pageSize: number = 10) {
    try {
        const userQb = await this.farmsRepository
          .createQueryBuilder("f")
          .select([
            'name', 'size', 'yield', 'email', 'uc.latitude' as 'u_latitude', 'uc.longitude' as 'u_longitude',
            'fa.street' as 'f_street', 'fa.city' as 'f_cityt', 'fa.country' as 'f_country', 
            'fc.latitude' as 'f_latitude', 'fc.longitude' as 'f_longitude', 'f.createdAt' as 'createdAt'
          ])
          .addSelect((subQuery) => {
            return subQuery.select('AVG("yield")*0.3').from("farm", "aa")
          }, "avg_yield")
          .addSelect((subQuery) => {
            return subQuery.select('size').from("farm", "ab").where("ab.id = f.id")
          }, "driving_distance")
          .leftJoin('f.user', 'u')
          .leftJoin('f.address', 'fa')
          .leftJoin('fa.coordinate', 'fc')
          .leftJoin('u.address', 'ua')
          .leftJoin('ua.coordinate', 'uc');

         let result = dataSource
          .createQueryBuilder()
          .select("*")
          .from("(" + userQb.getQuery() + ")", "d");

          console.log(outlierCondition);
          // Outlier condition
          //outlierCondition ? result.where("yield > avg_yield") : result.where("yield < avg_yield");
          
          console.log(result.getQuery());
          const farms = await result
           .offset((pageSize * page) - pageSize)
           .limit(pageSize)
           .getRawMany();

          let allFarms = await this.addDrivingDistanceToFarm(farms)
          console.log(allFarms);
          // Add sort on final output. 
          // I know performance wise its not better do here, but we have 3 different type of sorts. In this case I feel this is the wise way
          return this.sortResult(allFarms, sortBy);
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  private sortResult(farms: any, sortBy: string) {
    if (sortBy == "driving_distance") {
      return this.sortByDrivingDistance(farms);
    } else if (sortBy == "date") {
      return this.sortByNewlyCreatedFarm(farms);
    } else {
      return this.sortByFarmNameASC(farms);
    }
  }

  private sortByFarmNameASC(farms: any) {
    farms.sort((a: any, b: any) => {
      var valueA = a.name;
      var valueB = b.name;
      return valueA - valueB;
    });
    return farms;
  }

  private sortByNewlyCreatedFarm(farms: any) {
    farms.sort((a: any, b: any) => {
      var valueA = a.f_createdAt;
      var valueB = b.f_createdAt;
      return valueB - valueA;
    });
    return farms;
  }

  private sortByDrivingDistance(farms: any) {
    farms.sort((a: any, b: any) => {
      var valueA = a.driving_distance.value;
      var valueB = b.driving_distance.value;
      if (valueA < valueB) {
          return -1;
      } else if (valueA > valueB) {
          return 1;
      } else {
          return 0;
      }
    });
    return farms;
  }

  private async addDrivingDistanceToFarm(farms: any): Promise<any[]> {
    for (const key in farms) {
      let distance = await this.getDrivingDistance(
        farms[key].fc_latitude,
        farms[key].fc_longitude,
        farms[key].uc_latitude,
        farms[key].uc_longitude
      );
      farms[key].driving_distance = distance;
    };
    return farms;
  }
  
  private async getDrivingDistance(
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number
  ): Promise<string> {
    const apiKey = config.GOOGLE_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destinationLat},${destinationLng}&key=${apiKey}&mode=driving`;
  
    return axios
      .get(apiUrl)
      .then((response) => {
        const distance = response.data.rows[0].elements[0].distance;
        return distance;
      })
      .catch((error) => {
        throw new Error(`Error: ${error}`);
      });
  }

  public async createFarm(data: CreateFarmDto): Promise<Farm | null> {
    try {
      // Check if given owner email exists on not. If not throw error
      const user = await this.usersService.findOneBy({ email: data.email });
      if (!user) throw new UnprocessableEntityError("User not exists from given email.");

      const farmData = CreateFarmDto.createFromEntity(data);
      const existingFarm = await this.farmsRepository.findOneBy({ ...farmData });
      if (existingFarm) throw new UnprocessableEntityError("A farm with same name already exists on coordinates");

      const coordinateObj = await this.saveAndGetCoordinateId(data.address.coordinate);
      const addressObj = await this.saveAndGetAddressId(data.address, coordinateObj);

      console.log(coordinateObj);
      console.log(addressObj);

      const farmDeepData: DeepPartial<Farm> = { name: data.name, size: data.size, yield: data.yield, address: addressObj, user: user };
      const newFarm = this.farmsRepository.create(farmDeepData);
      
      return await this.farmsRepository.save(newFarm);
    } catch (error) {
      console.log(error)
    }
    return null;
  }

  /**
   * Function to save address if not existing and return coordinate id
   * @param address 
   * @param coordinate 
   * @returns CreateAddressDto
   */
  private async saveAndGetAddressId(address: CreateAddressDto, coordinate: CreateCoordinateDto): Promise<CreateAddressDto> {
    const existingAddress = await this.addressesService.findOneBy({ street: address.street, city: address.city, country: address.country });
    if (!existingAddress) {
      const addressData: DeepPartial<Address> = { street: address.street, city: address.city, country: address.country, coordinate: coordinate };
      const saveCoordinateData = await this.addressesService.createAddress(addressData as CreateAddressDto);
      return saveCoordinateData;
    } else {
      console.log("Address already exists");
      return existingAddress;
    }
  }

  /**
   * Function to save coordinate if not existing and return coordinate id
   * @param coordinate 
   * @returns CreateCoordinateDto
   */
  private async saveAndGetCoordinateId(coordinate: CreateCoordinateDto | null): Promise<CreateCoordinateDto> {
    const existingCoordinate = await this.coordinatesService.findOneBy({ latitude: coordinate?.latitude, longitude: coordinate?.longitude });
    if (!existingCoordinate) {
      const coordinateData: DeepPartial<Coordinate> = { latitude: coordinate?.latitude, longitude: coordinate?.longitude };
      const savedCoordinateData = await this.coordinatesService.createCoordinate(coordinateData as CreateCoordinateDto);
      return savedCoordinateData;
    } else {
      console.log("Coordinates already exists");
      return existingCoordinate;
    }
  }

  /*public async getAllFarm(sortBy: string = 'name'): Promise<Farm[] | []> {
    if (sortBy === 'date') {
      sortBy = 'createdAt';
    }
    
    const farms = await this.farmsRepository.find({
      relations: {  
        user: {
          address: {
            coordinate: true
          }
        },
        address: {
          coordinate: true
        }
      },
      order: {
        name: 'ASC'
      }

    });
    return farms;
  }*/

  /*
  public async findAll(sortBy: string, outlierCondition: true | false, page: number = 1, pageSize: number = 10) {
    try {
      let rawQuery = `
        SELECT * FROM 
          (
            SELECT
              f.name AS name,
              f.size AS size,
              f.yield AS yield,
              -- f.createdAt as cdate,
              u.email AS email, 
              fa.street AS street,
              fa.city AS city,
              fa.country AS country,
              fc.latitude AS f_latitude,
              fc.longitude AS f_longitude,
              uc.latitude AS u_latitude,
              uc.longitude AS u_longitude,
              (SELECT AVG("yield")*0.3 FROM "farm" "aa") AS "avg_yield",
              (SELECT size FROM "farm" "ab" WHERE ab.id = "f"."id") AS "driving_distance" 
            FROM "farm" AS "f"
            LEFT JOIN "user" AS "u" ON "u"."id"="f"."userId"
            LEFT JOIN "address" AS "fa" ON "fa"."id"="f"."addressId"
            LEFT JOIN "coordinate" AS "fc" ON "fc"."id"="fa"."coordinateId"
            LEFT JOIN "address" AS "ua" ON "ua"."id"="u"."addressId" 
            LEFT JOIN "coordinate" as "uc" ON "uc"."id"="ua"."coordinateId") "fd"
      `;
      // Outlier condition
      rawQuery = this.addOutlierCondition(rawQuery, outlierCondition);
      rawQuery = this.addLimitAndOffset(rawQuery, page, pageSize);
      
      const result = await this.farmsRepository.query(rawQuery);
      let farms = await this.addDrivingDistanceToFarm(result)
      return this.sortResult(farms, sortBy);
    } catch (error) {
      console.log(error)
    }
    return [];
  }

  private addOutlierCondition(rawQuery: string, outlierCondition: true | false) {
    return rawQuery += outlierCondition ? `WHERE yield > avg_yield` : `WHERE yield < avg_yield`;
  }

  private addLimitAndOffset(rawQuery: string, page: number = 1, pageSize: number = 10) {
    if (page > 1) {
      rawQuery += ` LIMIT ` + pageSize + ` OFFSET ` + page;
    } else {
      rawQuery += ` LIMIT ` + pageSize;
    }
    return rawQuery;
  }
 */

}
