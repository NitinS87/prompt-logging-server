import { createClient } from '@clickhouse/client';
import { Global, Module, DynamicModule, Provider } from '@nestjs/common';
import { ClickhouseService } from './clickhouse.service';
import { NodeClickHouseClientConfigOptions } from '@clickhouse/client/dist/client';
import { Clickhouse } from 'constant';

@Global()
@Module({})
export class ClickhouseModule {
  static register(options: NodeClickHouseClientConfigOptions): DynamicModule {
    const client = createClient(options);
    const clickhouseProvider: Provider = {
      provide: Clickhouse,
      useValue: client,
    };

    return {
      module: ClickhouseModule,
      providers: [clickhouseProvider, ClickhouseService],
      exports: [ClickhouseService],
      global: true,
    };
  }
}
