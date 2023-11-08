import { NextFunction, Request, Response } from "express";

export class CodeexercisesController {

  public async transform(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req);
      let data: any = ['super', '20.5', 'test', '23' ];

      for (let key in data) {
        // This line will transform values having number values
        // and for string type this will return NaN
        // i.e '20.5' & '23'
        let newValue = parseFloat(data[key]);

        // if Nan, i.e string, take it as it is and if not NaN take newly converted value.
        data[key] = isNaN(newValue) ? data[key] : newValue;
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

  public async stringCheck(req: Request, res: Response, next: NextFunction) {
    try {
      let query = require('url').parse(req.url,true).query;
      let result = false;
      const regex = /\d/;
      if (regex.test(query.inputString)) {
        result = true;
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  public async listFileNames(req: Request, res: Response, next: NextFunction) {
    try {
      const fs = require('fs');
      let query = require('url').parse(req.url,true).query;
      fs.access("./" + query.folderName, fs.constants.F_OK, (err: any) => {
        if (err) {
            res.status(404).send('Folder not found');
        } else {
            const files = this.getFilesInFolder(query.folderName, query.extension);
            res.status(200).send(files);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  private getFilesInFolder(folderPath: string, extension: string): String[] {
    const fs = require('fs');
    const path = require('path');
    try {
        const files: string[] = fs.readdirSync("./" + folderPath);
        console.log(files);
        const filteredFiles: string[] = files.filter((file: string) => {
            return path.extname(file).toLowerCase() === '.' + extension.toLowerCase();
        });
        return filteredFiles;
    } catch (error) {
        console.log(error)
    }
    return [];
  }
}
