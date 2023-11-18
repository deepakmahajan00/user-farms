import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";

describe("CodeexercisesController", () => {
  let app: Express;
  let agent: SuperAgentTest;
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

    agent = supertest.agent(app);
  });

  describe("POST /codeexercises/transform", () => {
    it("should return correct trasnform", async () => {
      await agent.get("/api/codeexercises/transform")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(["super", 20.5, "test", 23]);
      });
    });

    it("should return not found api", async () => {
        await agent.get("/codeexercises/transform")
        .expect(404);
      });
  });

  describe("POST /codeexercises/stringCheck", () => {
    it("should return string check TRUE", async () => {
      const inputString = "test-string23";
      await agent.get("/api/codeexercises/stringCheck")
      .query({"inputString": inputString})
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(true);
      });
    });

    it("should return string check FALSE", async () => {
        const inputString = "test-string";
        await agent.get("/api/codeexercises/stringCheck")
        .query({"inputString": inputString})
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(false);
        });
      });

    it("should return not found api", async () => {
        await agent.get("/codeexercises/stringCheck")
        .expect(404);
      });
  });

  describe("POST /codeexercises/listFileNames", () => {
    it("should return correct listFileNames", async () => {
      const folderName = "files";
      const extension = "csv";
      await agent.get("/api/codeexercises/listFileNames")
      .query({"folderName": folderName, "extension": extension})
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(["export.csv", "import.csv"]);
      });
    });

    it("should return empty", async () => {
        const folderName = "files";
        const extension = "wrongext";
        await agent.get("/api/codeexercises/listFileNames")
        .query({"folderName": folderName, "extension": extension})
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual([]);
        });
      });

    it("should return not found api", async () => {
        await agent.get("/codeexercises/listFileNames")
        .expect(404);
    });

    it("should return folder not found", async () => {
        const folderName = "unknowfolder";
        const extension = "csv";
        await agent.get("/api/codeexercises/listFileNames")
        .query({"folderName": folderName, "extension": extension})
        .expect(404)
        .catch((res) => {
          expect(res.body).toBe("Folder not found");
        });
     });
  });
});
