import { ClickHouseClient } from '@clickhouse/client';
import { Injectable, Inject } from '@nestjs/common';
import { Clickhouse } from 'constant';
import { DataSetDto } from './dto';

@Injectable()
export class ClickhouseService {
  constructor(@Inject(Clickhouse) private clickhouse: ClickHouseClient) {}

  async query(query: string) {
    const result = await this.clickhouse.query({ query, format: 'JSON' });
    const dataSet: DataSetDto = await result.json();
    // console.log(dataSet);
    return dataSet.data;
  }

  async insert(values: any) {
    const result = await this.clickhouse.insert({
      table: 'performance_metrics',
      values: [values],
      format: 'JSONEachRow',
    });
    return result;
  }
}
