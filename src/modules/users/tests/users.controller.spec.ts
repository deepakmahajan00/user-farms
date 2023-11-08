import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../users.service";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";

describe("UsersController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  let usersService: UsersService;

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

    agent = supertest.agent(app);
    usersService = new UsersService();
  });

  describe("POST /users", () => {
    const coordinate: CreateCoordinateDto = {latitude: 15.10, longitude:16.10};
    const address: CreateAddressDto = {coordinate: coordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: address };

    it("should create new user", async () => {
      const res = await agent.post("/api/users").send(createUserDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: expect.stringContaining(createUserDto.email) as string,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw UnprocessableEntityError if user already exists", async () => {
      await usersService.createUser(createUserDto);

      const res = await agent.post("/api/users").send(createUserDto);

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        name: "UnprocessableEntityError",
        message: "A user for the email already exists",
      });
    });
  });
});
