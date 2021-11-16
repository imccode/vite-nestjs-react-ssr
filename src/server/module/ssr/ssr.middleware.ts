import { Injectable, NestMiddleware } from '@nestjs/common'
import express, { NextFunction, Request, Response } from 'express'
import { clientPath } from '../../utils/path'
import { SSRService } from './ssr.service'

@Injectable()
export class SSRStaticMidleware implements NestMiddleware {
  constructor(private readonly ssr: SSRService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const server = await this.ssr.bootstrap()
    if (server) {
      server.middlewares(req, res, next)
    } else {
      express.static(clientPath())(req, res, next)
    }
  }
}