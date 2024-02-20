import * as Chalk from 'chalk';

import { existsSync, readFileSync } from 'fs';

import { Transporter } from './../transporters/transporter.class';
import { TransporterFactory } from './../transporters/transporter.factory';
import { ClientConfiguration } from './../classes/client-configuration.class';
import { configurationSchema } from './../validations/configuration.validation';

/**
 * @description
 *
 * @todo LOW :: Refactoring : should be simplified / cleaned : reading should not be here, this.transporter & this.configuration should be in a slot
 */
class Container {

  /**
   * @description
   */
  private static instance: Container = null;

  /**
   * @description
   */
  public configuration: ClientConfiguration = null;


  /**
   * @description
   */
  public transporters: { [id:string]: Transporter } = null;

  /**
   * @description
   */
  private readonly PATH: string = `${process.cwd()}/.cliamrc.json`;

  private constructor() {}

  /**
   * @description
   */
  static get(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance.set();
  }

  /**
   * @description
   */
  private set(): Container {

    this.configuration = new ClientConfiguration( this.validates( this.read(this.PATH) ) );

    this.transporters = this.configuration.transporters.reduce((result, transporter) => {
      result[transporter.id] = TransporterFactory.get(this.configuration.variables, transporter);
      return result;
    }, {});

    return this;
  }

  /**
   * @description
   *
   * @param path
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
   * @description
   *
   * @param configuration
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