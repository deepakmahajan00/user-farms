import { FindOptionsWhere, Repository, DeepPartial } from "typeorm";
import { Address } from "./entities/address.entity";
import dataSource from "orm/orm.config";
import { CreateAddressDto } from "./dto/create-address.dto";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";

export class AddressesService {
  private readonly addressesRepository: Repository<Address>;

  constructor() {
    this.addressesRepository = dataSource.getRepository(Address);
  }

  public async findOneBy(param: FindOptionsWhere<Address>): Promise<Address | null> {
    return this.addressesRepository.findOneBy({ ...param });
  }

  public async createAddress(data: CreateAddressDto): Promise<Address> {
    const { street, city, country, coordinate } = data;
    const addressData: DeepPartial<Address> = { street, city, country, coordinate };
    const newAddress = this.addressesRepository.create(addressData);
    return this.addressesRepository.save(newAddress);
  }

  /**
   * Function to save address if not existing and return coordinate id
   * @param address 
   * @param coordinate 
   * @returns CreateAddressDto
   */
  public async saveAndGetAddressId(address: CreateAddressDto, coordinate: CreateCoordinateDto): Promise<CreateAddressDto> {
    const existingAddress = await this.findOneBy({ street: address.street, city: address.city, country: address.country });
    if (!existingAddress) {
      const addressData: DeepPartial<Address> = {
        street: address.street,
        city: address.city,
        country: address.country,
        coordinate: coordinate
      };
      const saveCoordinateData = await this.createAddress(addressData as CreateAddressDto);
      return saveCoordinateData;
    } else {
      console.log("Address already exists");
      return existingAddress;
    }
  }
}
