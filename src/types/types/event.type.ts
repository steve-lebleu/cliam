/**
 * @description Transactional email events
 */
export type Event = 'default' | 'event.subscribe' | 'event.unsubscribe' | 'event.updated' | 'user.progress' | 'user.survey' | 'user.welcome' | 'user.bye' | 'user.confirm' | 'user.contact' | 'user.invite' | 'order.invoice' | 'order.shipped' | 'order.progress' | 'password.request' | 'password.updated';