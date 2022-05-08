# tunneled-sequelize-auto

Console tool for generating sequelize models for working with database

It was originally created to work with the database of the Bitrix framework

You need to disable `skip-name-resolve` property in your MySQL config. For BitrixVM it located in `/etc/my.cnf`

Allows you to connect to a remote database via ssh tunnel and create the models and types (for typescript) with one command

It also allows you to connect to the database directly, for this you need to skip the ssh* parameters

| Parameter | Required                                              |
|-----------|-------------------------------------------------------|
| lang      | No (es5, es6 (default), esm, ts)                      |
| sshUser   | Yes                                                   |
| sshHost   | Yes                                                   |
| sshPass   | Yes                                                   |
| sshPort   | No (22 is default)                                    |
| dbUser    | No ("bitrix0" default)                                |
| dbPass    | Yes                                                   |
| dbName    | No ("sitemanager" default)                            |
| dbHost    | No ("localhost" default)                              |
| dbPort    | No (3306 default)                                     |
| path      | No ("./src/models" default)                           |

Example: `npx tunneled-sequelize-auto --sshUser=bitrix --sshPass=asinfi235ion --sshHost=192.168.0.113 --dbPass="sdsada" --lang=ts --path="./backend/models`

To import all models, you need to call `initModels` function

```javascript
import {initModels} from "./models/initModels";
...
const models = initModels(sequelize);
models.User.findAll({ where: { username: "tony" }}).then(...);
```

or you can use each model separately