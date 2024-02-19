import { MODE } from "types/enums/mode.enum"
import { PROVIDER } from "types/enums/provider.enum"

export interface ITransporterDefinition {
  id: string
  mode: MODE
  provider: PROVIDER
  auth: {
    apiKey?: string
    apiSecret?: string
    username?: string
    password?: string
  }
  options: {
    host: string,
    port: number,
    secure: boolean,
    templates: {[event: string]: string}
  }
}