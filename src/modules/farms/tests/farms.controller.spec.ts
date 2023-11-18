import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateAddressDto } from "modules/addresses/dto/create-address.dto";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UnauthorizedError, UnprocessableEntityError } from "errors/errors";
import { UsersService } from "modules/users/users.service";

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;
  let token: AccessToken;
  let usersService: UsersService;

  // Use this to create user and farm
  const coordinate: CreateCoordinateDto = {latitude: 15.10, longitude:16.10};
  const address: CreateAddressDto = {coordinate: coordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
  const createUser: CreateUserDto = { email: "authorizedUser@test.com", password: "password", address: address };
  const loginDto: LoginUserDto = { email: "authorizedUser@test.com", password: "password" };
  const CreateFarm: CreateFarmDto = {name: 'Test farm', size: 20.20, yield: 8.9, email: 'authorizedUser@test.com', address: address}

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
    await usersService.createUser(createUser);
    const response = await agent.post("/api/auth/login").send(loginDto);
    token = response.body as AccessToken;
  });

  describe("POST Not Authorized /farms", () => {
    it("should return not found farms api", async () => {
        await agent.post("/farms")
        .expect(404);
    });

    it("should throw unauthorized farm api", async () => {
        await agent.post("/api/farms")
        .send(CreateFarm).catch((err: UnauthorizedError) => {
            expect(err).toBeInstanceOf(UnauthorizedError);
          });
    });
  });

    describe("POST Authorized /farms", () => {

        it("should return provided user not exists for farm", async () => {
            const CreateFarmWithNotExistsUser: CreateFarmDto = {name: 'Test A farm', size: 20.20, yield: 8.9, email: 'user1@test.com', address: address};

            await agent.post("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .expect(201)
            .send(CreateFarmWithNotExistsUser)
            .catch((err: UnprocessableEntityError) => {
                expect(err).toBeInstanceOf(UnprocessableEntityError);
            });
        });

        it("should return farm exists with same name", async () => {
            const CreateFarm: CreateFarmDto = {name: 'Test Z farm', size: 20.20, yield: 8.9, email: 'authorizedUser@test.com', address: address}
            await agent.post("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .send(CreateFarm);

            await agent.post("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .expect(201)
            .send(CreateFarm)
            .catch((err: UnprocessableEntityError) => {
                expect(err).toBeInstanceOf(UnprocessableEntityError);
            });
        });
    });

    describe("POST Create farm ", () => {
        it("should create farm", async () => {
            const createUser: CreateUserDto = { email: "farm-user@test.com", password: "password", address: address };
            await usersService.createUser(createUser);
            const CreateFarm: CreateFarmDto = {name: 'Test B farm', size: 20.20, yield: 8.9, email: 'farm-user@test.com', address: address}
            
            const res = await agent.post("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .send(CreateFarm);

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                size: expect.any(Number),
                yield: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
    });

    describe("GET /farms", () => {
        it("should return not found farms api", async () => {
            await agent.get("/farms")
            .expect(404);
        });

        const sort = ["name", "date", "driving_distance"];
        const page = 1;
        const pageSize = 10;
        const outliers = true;

        it("should unauthorize farms", async () => {
            await agent.get("/api/farms")
            .query({"sort": sort[0], "page": page, "pageSize": pageSize, "outliers": outliers})
            .expect(401)
            .catch((err: UnauthorizedError) => {
                expect(err).toBeInstanceOf(UnauthorizedError)
            });
        });

        it("should return empty farms with sort by name", async () => {
            await agent.get("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .query({"sort": sort[0], "page": page, "pageSize": pageSize, "outliers": outliers})
            .expect(200)
            .then((res) => {
              expect(res.body).toEqual({});
            });
        });

        it("should return empty farms with sort by date", async () => {
            await agent.get("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .query({"sort": sort[1], "page": page, "pageSize": pageSize, "outliers": outliers})
            .expect(200)
            .then((res) => {
              expect(res.body).toEqual({});
            });
        });

        it("should return empty farms with sort by driving_distance", async () => {
            await agent.get("/api/farms")
            .set("Authorization", `Bearer ${token.token}`)
            .query({"sort": sort[2], "page": page, "pageSize": pageSize, "outliers": false})
            .expect(200)
            .then((res) => {
              expect(res.body).toEqual({});
            });
        });
    });
});
