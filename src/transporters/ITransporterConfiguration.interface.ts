import { PROVIDER } from "types/enums/provider.enum"
import { ITransporterOptions } from "./ITransporterOptions.interface"
import { ITransporterCredentials } from "./ITransporterCredentials.interface"

/**
 * @description Define how a transporter configuration must be formed
 */
export interface ITransporterConfiguration {
  id: string
  provider: PROVIDER
  auth: ITransporterCredentials
  options: ITransporterOptions
  templates?: Record<string,string>[]
}