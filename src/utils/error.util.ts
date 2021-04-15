import { IMailjetErrorMessage } from 'transporters/mailjet/IMailjetErrorMessage.interface';

/**
 * @description
 *
 * @param input
 */
const getMailjetErrorMessages = ( input: IMailjetErrorMessage[] ): string[] => {
  return input.map( (message: { Errors: { ErrorMessage: string }[] } ) => message.Errors.map( (error: { ErrorMessage: string } ) => error.ErrorMessage ).join(',') );
};

export { getMailjetErrorMessages };