#! /usr/bin/env node

import Db from "./db";
import { SequelizeAuto } from "sequelize-auto";
import { LangOption } from "sequelize-auto/types/types";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

class ScriptParams {
  public lang: LangOption = "es6";

  public path: string = "./src/models";

  public sshUser: string = "";
  public sshHost: string = "";
  public sshPass: string = "";
  public sshPort: number = 22;

  public dbUser: string = "bitrix0";
  public dbPass: string = "";
  public dbName: string = "sitemanager";
  public dbHost: string = "localhost";
  public dbPort: number = 3306;
}
const config = { ...new ScriptParams(), ...yargs(hideBin(process.argv)).argv };

const isTunnelNeeded = ({ sshHost, sshPass, sshUser }: ScriptParams) =>
  !!(sshUser || sshPass || sshHost);

const requiredParams = [
  "dbPass",
  ...(isTunnelNeeded(config) ? ["sshUser", "sshHost", "sshPass"] : []),
];

const missingKeys: string[] = [];
requiredParams.forEach((key) => {
  if (!config[key]) {
    missingKeys.push(key);
  }
});

if (missingKeys.length > 0) {
  console.log(
    `❌  The following parameters are required but not specified: ${missingKeys.join(
      ", "
    )}`
  );
  process.exit(1);
}

(async () => {
  const {
    sshUser,
    sshHost,
    sshPass,
    sshPort,
    dbPort,
    dbHost,
    dbUser,
    dbPass,
    dbName,
    lang,
    path,
  } = config;
  if (isTunnelNeeded(config)) {
    try {
      await Db.establishTunnel(
        {
          username: sshUser,
          host: sshHost,
          password: sshPass,
          port: sshPort,
        },
        dbPort
      );
      console.log("Step 1: ✅  Tunnel established");
    } catch (e) {
      console.log("❌  Error during tunnel establishing : ", e);
      process.exit(1);
    }
  } else {
    console.log("Step 1 skipped, no tunnel needed");
  }
  try {
    Db.dbConfig = {
      username: dbUser,
      password: dbPass,
      database: dbName,
      host: dbHost,
      port: dbPort,
    };

    await Db.instance.authenticate();
    console.log("Step 2: ✅  Database connection established");
  } catch (e) {
    console.log("❌  Error during db authentication : ", e);
    process.exit(1);
  }

  try {
    await new SequelizeAuto(Db.instance, null, null, {
      dialect: "mysql",
      directory: path,
      caseModel: "c",
      caseFile: "c",
      singularize: false,
      lang,
      useDefine: true,
    }).run();

    console.log("Step 3: ✅  Models generated successfully");
    process.exit(0);
  } catch (e) {
    console.log("❌  Error during models generation : ", e);
    process.exit(1);
  }
})();
