import * as Chalk from 'chalk';

import { existsSync, readFileSync } from 'fs';

import { Transporter } from './../transporters/transporter.class';
import { TransporterFactory } from './../transporters/transporter.factory';
import { ClientConfiguration } from './../classes/client-configuration.class';
import { configurationSchema } from './../validations/configuration.validation';

/**
 * @description This class act like ... a container. She's a singleton, instanciated only one time when the application is ran. Mostly, she's responsible of:
 * 
 * - Reading, validation and expostion of the client configuration
 * - Instanciation and exposition of the transporters
 */
class Container {

  /**
   * @description Container instance
   */
  private static instance: Container = null;

  /**
   * @description ClientConfiguration instance
   */
  public configuration: ClientConfiguration = null;


  /**
   * @description Transporter instances stored by key / value pairs
   */
  public transporters: { [id:string]: Transporter } = null;

  /**
   * @description Path of the cliamrc configuration. Always at root of the project.
   */
  private readonly PATH: string = `${process.cwd()}/.cliamrc.json`;

  /**
   * @description Don't come here motherfucker
   */
  private constructor() {}

  /**
   * @description Get current container instance. Instanciate it if not present.
   * 
   * @returns {Container} Container instance
   */
  static get(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance.set();
  }

  /**
   * @description Set configuration and transporters properties
   * 
   * @returns {Container} Container instance
   */
  private set(): Container {

    this.configuration = new ClientConfiguration( this.validates( this.read(this.PATH) ) );

    this.transporters = this.configuration.transporters.reduce((result, transporterDefinition) => {
      result[transporterDefinition.id] = TransporterFactory.get(this.configuration.variables, transporterDefinition);
      return result;
    }, {});

    return this;
  }

  /**
   * @description Read the cliamrc configuration file and return it
   *
   * @param path Path of the cliamrc file
   * 
   * @returns {Record<string,unknown>} Object containing client configuration values
   */
  private read(path: string): Record<string,unknown> {
    if (!existsSync(path)) {
     process.stdout.write( Chalk.bold.red('.cliamrc.json file cannot be found\n') );
     process.exit(0);
    }
    const content = readFileSync(path, { encoding: 'utf-8' });
    if (!content) {
      process.stdout.write( Chalk.bold.red('.cliamrc.json content not found\n') );
      process.exit(0);
    }
    return JSON.parse(content) as Record<string,unknown>;
  }

  /**
   * @description Validates the client configuration setup
   *
   * @param configuration
   * 
   * @returns {Record<string,unknown>}
   */
  private validates(configuration: Record<string,unknown>): Record<string,unknown> {
    const error = configurationSchema.validate(configuration, { abortEarly: true, allowUnknown: false })?.error;
    if (error) {
      process.stdout.write( Chalk.bold.red(`Error in .cliamrc.json: ${error.details.shift().message}\n`) );
      process.exit(0);
    }
    return configuration;
  }
}

const service = Container.get();

export { service as Container };