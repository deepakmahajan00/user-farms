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
    it("should return not found api", async () => {
      await agent.get("/codeexercises/transform")
      .expect(404);
    });

    it("should return correct trasnform", async () => {
      const requestBody = {
        inputArray: ["super", "20.5", "test", "23"]
      };
      const result: any[] = ["super", 20.5, "test", 23];
      const resp = await agent.post("/api/codeexercises/transform").send(requestBody)
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual(result);
    });

    it("should return empty trasnform", async () => {
      const requestBody = {
        inputArray: []
      };
      const result: any[] = [];
      const resp = await agent.post("/api/codeexercises/transform").send(requestBody)
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual(result);
    });

    it("should return empty if we send wrong body trasnform", async () => {
      const requestBody = {
        wrongParam: []
      };
      const resp = await agent.post("/api/codeexercises/transform").send(requestBody)
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({});
    });
  });

  describe("GET /codeexercises/stringCheck", () => {
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

  describe("GET /codeexercises/listFileNames", () => {
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
