import { FindOptionsWhere, Repository, DeepPartial } from "typeorm";
import { Address } from "./entities/address.entity";
import dataSource from "orm/orm.config";
import { CreateAddressDto } from "./dto/create-address.dto";

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
}
