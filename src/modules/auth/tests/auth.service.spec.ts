import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import http, { Server } from "http";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";

describe("AuthService", () => {
  let app: Express;
  let usersService: UsersService;
  let authService: AuthService;
  let server: Server;

  beforeAll(async () => {
    app = setupServer();
    await ds.initialize();

    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(async () => {
    await disconnectAndClearDatabase(ds);
    server.close();
  });

  beforeEach(async () => {
    await clearDatabase(ds);

    usersService = new UsersService();
    authService = new AuthService();
  });

  const coordinate: CreateCoordinateDto = {latitude: 15.10, longitude:16.10};
  const address: CreateAddressDto = {coordinate: coordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
  const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: address };

  describe(".login", () => {
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);

    it("should create access token for existing user", async () => {
      await createUser(createUserDto);

      const { token } = await authService.login(loginDto);

      expect(token).toBeDefined();
    });

    it("should throw UnprocessableEntityError when user logs in with invalid email", async () => {
      await authService.login({ email: "invalidEmail", password: "pwd" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });

    it("should throw UnprocessableEntityError when user logs in with invalid password", async () => {
      await createUser(createUserDto);

      await authService.login({ email: loginDto.email, password: "invalidPassword" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });
  });
});
