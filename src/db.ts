import { Sequelize } from "sequelize";
import tunnel from "tunnel-ssh";

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host?: string;
  port?: number;
};

type SSHTunnelConfig = {
  username: string;
  host: string;
  password: string;
  port?: number;
};

export default class Db {
  private static dbConf: DBConfig;
  private static dbInst: Sequelize;
  private static tunnelEstablished: boolean;

  private constructor() {}

  static set dbConfig(config: DBConfig) {
    const { host, port } = config;
    this.dbConf = {
      ...config,
      host: host ?? "localhost",
      port: port ?? 3306,
    };
  }

  static async establishTunnel(
    config: SSHTunnelConfig,
    dbPort: number = 3306
  ): Promise<void> {
    if (!this.tunnelEstablished) {
      const { port } = config;
      return new Promise((resolve, reject) => {
        tunnel(
          {
            ...config,
            port,
            dstPort: dbPort,
            keepAlive: true,
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              this.tunnelEstablished = true;
              resolve();
            }
          }
        );
      });
    }
  }

  static get instance(): Sequelize {
    if (!this.dbConf) {
      throw new Error(
        "Before invoking an instance, you must configure the connection"
      );
    }
    if (!this.dbInst) {
      this.dbInst = new Sequelize({
        dialect: "mysql",
        ...this.dbConf,
      });
    }
    return this.dbInst;
  }
}
