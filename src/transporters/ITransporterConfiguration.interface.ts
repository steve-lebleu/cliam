import { MODE } from "types/enums/mode.enum"
import { PROVIDER } from "types/enums/provider.enum"
import { ITransporterOptions } from "./ITransporterOptions.interface"
import { ITransporterCredentials } from "./ITransporterCredentials.interface"

/**
 * @description Define how a transporter configuration must be formed
 */
export interface ITransporterConfiguration {
  id: string
  mode: MODE
  provider: PROVIDER
  auth: ITransporterCredentials
  options: ITransporterOptions
}