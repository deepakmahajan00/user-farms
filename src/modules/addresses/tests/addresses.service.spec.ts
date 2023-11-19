import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import { CreateCoordinateDto } from "modules/coordinates/dto/create-coordinate.dto";
import { UnprocessableEntityError } from "errors/errors";
import { AddressesService } from "../addresses.service";
import { CreateAddressDto } from "../dto/create-address.dto";
import { CoordinatesService } from "modules/coordinates/coordinates.service";
import { Address } from "../entities/address.entity";

describe("AddressesService", () => {
  let app: Express;
  let server: Server;
  let addressesService: AddressesService;
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

  const coordinate: CreateCoordinateDto = {latitude: 15.10, longitude:16.10};
  let address: CreateAddressDto = {coordinate: coordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
  let createdCordinate: CreateCoordinateDto;
  beforeEach(async () => {
    await clearDatabase(ds);
    addressesService = new AddressesService();
    coordinatesService = new CoordinatesService();

    createdCordinate = await coordinatesService.saveAndGetCoordinateId(coordinate);
    address = {coordinate: createdCordinate, street: "City 2", city: "Taastrup", country: "Denmark"};
  });
  

  describe(".saveAndGetAddressId", () => {
    it("should save address if not exists", async () => {
      const newAddress = await addressesService.saveAndGetAddressId(address, createdCordinate);
      expect(newAddress).toMatchObject({
        id: expect.any(String),
        street: expect.any(String),
        city: expect.any(String),
        country: expect.any(String),
        coordinate: expect.objectContaining({latitude: 15.10, longitude:16.10}) as CreateCoordinateDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return already exists message", async () => {
        await addressesService.saveAndGetAddressId(address, createdCordinate).catch((error: UnprocessableEntityError) => {
            expect(error).toBeInstanceOf(UnprocessableEntityError);
            expect(error.message).toBe("Address already exists");
        });
    });
  });

  describe(".createAddress", () => {
    it("should create new address", async () => {
      const createdAddress = await addressesService.createAddress(address);
      expect(createdAddress).toBeInstanceOf(Address);
    });

    describe("with existing address", () => {
      beforeEach(async () => {
        await addressesService.createAddress(address);
      });

      it("should throw UnprocessableEntityError if address already exists", async () => {
        await addressesService.createAddress(address).catch((error: UnprocessableEntityError) => {
          expect(error).toBeInstanceOf(UnprocessableEntityError);
          expect(error.message).toBe("Address already exists!");
        });
      });
    });
  });
});
