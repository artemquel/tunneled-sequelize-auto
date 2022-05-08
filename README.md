You need to disable `skip-name-resolve` property in your MySQL config. For BitrixVM it located in `/etc/my.cnf`

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
| path      | No ("./src/models" default)                                     |