import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { OutgoingHttpHeaders } from 'http2';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private clickhouseService: ClickhouseService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.apiKey) req.body.apiKey = process.env.OPENAI_API_KEY;
    if (!req.body.model) req.body.model = process.env.OPENAI_DEFAULT_MODEL;

    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    };
    // console.log('Request:', requestLog);
    // console.log(
    //   'messages: ',
    //   requestLog.body.messages[requestLog.body.messages.length - 1],
    // );

    const start = Date.now();

    const oldSend = res.send;
    let responseLog: {
      statusCode: number;
      body: any;
      headers: OutgoingHttpHeaders;
      latency: number;
      success: boolean;
    };
    res.send = (...args: any[]) => {
      // console.log(args);
      const end = Date.now();
      const latency = end - start;

      responseLog = {
        statusCode: res.statusCode,
        body: args[0], // assuming the first argument is the data
        headers: res.getHeaders(),
        latency: latency,
        success: res.statusCode >= 200 && res.statusCode < 300,
      };
      // console.log('Response:', responseLog);

      const responseBody = JSON.parse(responseLog.body);

      // console.log(responseBody.choices);

      const values = {
        user: requestLog.body.user,
        status: responseLog.success ? 'success' : 'failure',
        request:
          requestLog.body.messages[requestLog.body.messages.length - 1].content,
        response: responseBody.choices[0].message.content,
        model: requestLog.body.model,
        prompt_tokens: responseBody.usage.prompt_tokens,
        completion_tokens: responseBody.usage.completion_tokens,
        total_tokens: responseBody.usage.total_tokens,
        latency: responseLog.latency / 1000,
        created_at: new Date().toISOString(),
      };

      // console.log(values);
      this.clickhouseService.insert(values);

      return oldSend.apply(res, args);
    };

    next();
  }
}
