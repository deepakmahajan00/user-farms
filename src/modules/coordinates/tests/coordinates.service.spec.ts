import config from "config/config";
//import { UnprocessableEntityError } from "errors/errors";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { CoordinatesService } from "../coordinates.service";
import { Coordinate } from "../entities/coordinate.entity";
import { UnprocessableEntityError } from "errors/errors";

describe("CoordinatesService", () => {
  let app: Express;
  let server: Server;
  let coordinatesService: CoordinatesService;

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
    coordinatesService = new CoordinatesService();
  });

  const createCoordinate: CreateCoordinateDto = {latitude: 15.10, longitude:16.10};

  describe(".createCoordinate", () => {
    it("should create new coordinates", async () => {
      const createdCordinates = await coordinatesService.createCoordinate(createCoordinate);
      expect(createdCordinates).toBeInstanceOf(Coordinate);
    });

    describe("with existing coordinate", () => {
      beforeEach(async () => {
        await coordinatesService.createCoordinate(createCoordinate);
      });

      it("should throw UnprocessableEntityError if coordinate already exists", async () => {
        await coordinatesService.createCoordinate(createCoordinate).catch((error: UnprocessableEntityError) => {
          expect(error).toBeInstanceOf(UnprocessableEntityError);
          expect(error.message).toBe("Coordinates already exists!");
        });
      });
    });
  });

  describe(".findOneBy", () => {
    it("should get coordinate by provided param", async () => {
      const coordinate = await coordinatesService.createCoordinate(createCoordinate);
      const foundCoordinate = await coordinatesService.findOneBy({ latitude: coordinate.latitude, longitude: coordinate.longitude });
      expect(foundCoordinate?.id).toBe(coordinate.id);
    });

    it("should return null if coordinates not found by provided param", async () => {
      const notExistsCoordinate: CreateCoordinateDto = {latitude: 151.10, longitude:162.10};
      const foundCoordinate = await coordinatesService.findOneBy(notExistsCoordinate);
      expect(foundCoordinate).toBeNull();
    });
  });

  describe(".saveAndGetCoordinateId", () => {
    it("should save coordinate if not exists", async () => {
      const notExistsCoordinate: CreateCoordinateDto = {latitude: 17.10, longitude:18.10};
      const foundCoordinate = await coordinatesService.saveAndGetCoordinateId(notExistsCoordinate);
      expect(foundCoordinate).toMatchObject({
        id: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    describe("with existing coordinate", () => {
        beforeEach(async () => {
            await coordinatesService.createCoordinate(createCoordinate);
        });

        it("should return already exists message", async () => {
            await coordinatesService.saveAndGetCoordinateId(createCoordinate).catch((error: UnprocessableEntityError) => {
                expect(error).toBeInstanceOf(UnprocessableEntityError);
                expect(error.message).toBe("Coordinates already exists!");
            });
        });
    });
  });
});
