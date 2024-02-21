/**
 * @description
 */
export enum EVENT {
  'default' = 'default',
  'event.subscribe' = 'event.subscribe',
  'event.unsubscribe' =  'event.unsubscribe',
  'event.updated' = 'event.updated', 
  'user.progress' = 'user.progress',
  'user.survey' = 'user.survey',
  'user.welcome' = 'user.welcome',
  'user.bye' = 'user.bye',
  'user.confirm' = 'user.confirm',
  'user.contact' = 'user.contact',
  'user.invite' = 'user.invite',
  'order.invoice' = 'order.invoice',
  'order.shipped' = 'order.shipped',
  'order.progress' = 'order.progress',
  'password.request' = 'password.request',
  'password.updated' = 'password.updated'
}