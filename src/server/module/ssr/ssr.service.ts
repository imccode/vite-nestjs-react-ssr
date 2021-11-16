import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer, ViteDevServer } from 'vite'
import { TEMPLATE_SLOT } from '../../utils/constant'
import { env } from '../../utils/env'
import { clientPath, resolvePath } from '../../utils/path'

@Injectable()
export class SSRService {
  server: ViteDevServer

  async bootstrap() {
    if (!this.server && env.DEV) {
      this.server = await createServer({
        server: {
          middlewareMode: 'ssr',
          watch: {
            usePolling: true,
            interval: 100,
          },
        },
      })
    }
    return this.server
  }

  async ssrDevRender(url: string, data: RenderParams['ssrData'] = {}) {
    const { createApp } = await this.server.ssrLoadModule(
      resolvePath('src/client/main.tsx')
    )

    let template = readFileSync(resolvePath('index.html'), 'utf-8')
    template = await this.server.transformIndexHtml(url, template)

    return await this.render({
      url,
      appConfig: createApp(url, data),
      template,
      ssrData: data,
    })
  }

  async ssrRender(url: string, data: RenderParams['ssrData'] = {}) {
    const { createApp } = require(resolvePath('dist/pages/main.js'))

    return await this.render({
      url,
      appConfig: createApp(url, data),
      template: readFileSync(clientPath('index.html'), 'utf-8'),
      ssrData: data,
    })
  }

  private async render({ url, ssrData, template, appConfig }: RenderParams) {

    let html = ''
    try {
      html = renderToString(appConfig.app)
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    // ssr replace
    html = template.replace(TEMPLATE_SLOT.ssrInject, html)

    // head replace
    html = html.replace(
      TEMPLATE_SLOT.headInject,
      this.generateScriptBlock(ssrData, 'ssrData')
    )

    // body replace
    html = html.replace(TEMPLATE_SLOT.bodyInject, '')

    return html
  }

  private generateScriptBlock(
    data: { [key: string]: any },
    variableName: string
  ) {
    return `<script>${variableName}=${JSON.stringify(data)}</script>`
  }
}

export type ReturnClientCreateAppType = { app: React.ReactElement }

interface RenderParams {
  url: string
  ssrData: { [key: string]: any }
  template: string
  appConfig: ReturnClientCreateAppType
}
