import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateCoordinateDto } from "../dto/create-coordinate.dto";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { UnauthorizedError } from "errors/errors";
import { UsersService } from "modules/users/users.service";

describe("CoordinatesController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;
  let token: AccessToken;
  let usersService: UsersService;

  const coordinate: CreateCoordinateDto = {latitude: 15.11, longitude:16.11};
  const address: CreateAddressDto = {coordinate: coordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
  const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: address };
  const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };

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

    await usersService.createUser(createUserDto);
    const response = await agent.post("/api/auth/login").send(loginDto);
    token = response.body as AccessToken;

    await agent.post("/api/coordinates")
      .set("Authorization", `Bearer ${token.token}`)
      .send(coordinate);
  });

  describe("POST /api/coordinates", () => {
    const CoordinateDto: CreateCoordinateDto = {latitude: 15.12, longitude:16.12};
    
    it("should create new coordinates", async () => {
      const res = await agent.post("/api/coordinates")
      .set("Authorization", `Bearer ${token.token}`)
      .send(CoordinateDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw coordinate already exists", async () => {
        const res = await agent.post("/api/coordinates")
        .set("Authorization", `Bearer ${token.token}`)
        .send(coordinate);

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
        message: "Coordinates already exists!",
      });
    });

    it("should throw unauthorized", async () => {
        await agent.post("/api/coordinates")
        .send(coordinate).catch((err: UnauthorizedError) => {
            expect(err).toBeInstanceOf(UnauthorizedError);
            expect(err.message).toEqual("Unauthorized");
          });
    });
  });
});
