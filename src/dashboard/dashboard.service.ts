import { Injectable } from '@nestjs/common';
import { DashboardDto } from './dto';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';

@Injectable()
export class DashboardService {
  constructor(private clickhouse: ClickhouseService) {}

  async getData(data: DashboardDto, page: number, limit: number) {
    if (limit === 0) limit = 10;
    const offset = page * limit;

    let whereClause = 'WHERE ';
    if (data.user) whereClause += `user = '${data.user}' AND `;
    if (data.status) whereClause += `status = '${data.status}' AND `;
    if (data.model) whereClause += `model = '${data.model}' AND `;
    if (data.latency) whereClause += `latency <= ${data.latency} AND `;
    whereClause += `created_at >= NOW() - INTERVAL ${data.days ?? 7} DAY`;

    const dataQuery = `SELECT * FROM performance_metrics
                    ${whereClause}
                    ORDER BY
                        created_at DESC
                    LIMIT
                        ${limit}
                    OFFSET
                        ${offset};`;

    // console.log(dataQuery);

    const aggregateQuery = `SELECT
                        SUM(prompt_tokens) as totalInputTokens,
                        SUM(completion_tokens) as totalOutputTokens,
                        COUNT(*) AS numberOfRequests,
                        AVG(latency) AS averageLatency,
                        quantileExact(0.95)(latency) AS p95Latency,
                        COUNT(CASE WHEN status = 'failure' THEN 1 END) AS totalFailures,
                        CASE 
                            WHEN (MAX(created_at) - MIN(created_at)) = 0 THEN 0 
                            ELSE SUM(prompt_tokens) / (MAX(created_at) - MIN(created_at)) 
                        END AS inputTokensPerSecond
                    FROM
                        performance_metrics
                    ${whereClause};`;

    const result = await this.clickhouse.query(dataQuery);
    const aggregate = await this.clickhouse.query(aggregateQuery);

    return {
      result,
      aggregate,
    };
  }
}
