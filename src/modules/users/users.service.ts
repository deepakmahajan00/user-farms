import * as bcrypt from "bcrypt";
import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import dataSource from "orm/orm.config";
import { AddressesService } from "modules/addresses/addresses.service";
import { CoordinatesService } from "modules/coordinates/coordinates.service";

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
    
    const coordinateObj = await this.coordinatesService.saveAndGetCoordinateId(address.coordinate);
    const addressObj = await this.addressesService.saveAndGetAddressId(address, coordinateObj);

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
}
