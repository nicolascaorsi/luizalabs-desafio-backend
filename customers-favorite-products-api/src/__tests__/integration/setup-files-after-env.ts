import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;

beforeAll(async () => {
  jest.setTimeout(120000);
  postgresContainer = await new PostgreSqlContainer('postgres:17-alpine')
    .withNetworkMode('luizalabs-desafio-backend_default')
    .start();

  postgresClient = new Client(postgresContainer.getConnectionUri());
  await postgresClient.connect();
  globalThis.postgresConnectionUri = postgresContainer.getConnectionUri();
  // globalThis.postgresClient = postgresClient
  // globalThis.postgresContainer = postgresContainer
});

afterAll(async () => {
  await postgresClient?.end();
  await postgresContainer?.stop();
});
