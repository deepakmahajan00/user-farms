import * as bcrypt from "bcrypt";
import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import dataSource from "orm/orm.config";
import { AddressesService } from "modules/addresses/addresses.service";
import { CoordinatesService } from "modules/coordinates/coordinates.service";
import { Coordinate } from "modules/coordinates/entities/coordinate.entity";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";
import { Address } from "modules/addresses/entities/address.entity";

export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly addressesService: AddressesService;
  private readonly coordinatesService: CoordinatesService;

  constructor() {
    this.usersRepository = dataSource.getRepository(User);
    this.addressesService = new AddressesService();
    this.coordinatesService = new CoordinatesService();
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password, address } = data;
    const existingUser = await this.findOneBy({ email: email });
    if (existingUser) throw new UnprocessableEntityError("A user for the email already exists");

    const hashedPassword = await this.hashPassword(password);
    
    const coordinateObj = await this.saveAndGetCoordinateId(address.coordinate);
    const addressObj = await this.saveAndGetAddressId(address, coordinateObj);

    const userData: DeepPartial<User> = { email, hashedPassword, address: addressObj };
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }

  private async hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(salt_rounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * Function to save address if not existing and return coordinate id
   * @param address 
   * @param coordinate 
   * @returns CreateAddressDto
   */
  private async saveAndGetAddressId(address: CreateAddressDto, coordinate: CreateCoordinateDto): Promise<CreateAddressDto> {
    const existingAddress = await this.addressesService.findOneBy({ street: address.street, city: address.city });
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
}
