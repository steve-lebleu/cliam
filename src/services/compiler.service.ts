import { readFileSync } from 'fs';

import * as Hbs from 'hbs';
import * as Color from 'color';

import { htmlToText } from 'html-to-text';

import { Container } from './../services/container.service';

/**
 * On the fly hbs compilation middleware
 */
class Compiler {

  /**
   * @description
   */
  private static instance: Compiler = null;

  /**
   * @description
   */
  private readonly LAYOUT: string = '/src/views/layouts/default.hbs';

  /**
   * @description
   */
  private readonly PARTIALS: string = '/src/views/partials/';

  /**
   * @description
   */
  private readonly BLOCKS: string = '/src/views/blocks/';

  /**
   * @description
   */
   private readonly TEMPLATES: Array<{[key: string]: string|boolean}> = [
    { event: 'default', banner: '', default: true },
    { event: 'event.subscribe', banner: '', default: true },
    { event: 'event.unsubscribe', banner: '', default: true },
    { event: 'event.updated', banner: '', default: true },
    { event: 'order.invoice', banner: '' },
    { event: 'order.progress', banner: '' },
    { event: 'order.shipped', banner: '' },
    { event: 'password.request', banner: '', default: true },
    { event: 'password.updated', banner: '', default: true },
    { event: 'user.invite', banner: '' },
    { event: 'user.contact', banner: '', default: true },
    { event: 'user.progress', banner: '' },
    { event: 'user.survey', banner: '' },
    { event: 'user.welcome', banner: '', default: true },
    { event: 'user.bye', banner: '', default: true },
    { event: 'user.confirm', banner: '', default: true }
  ];

  /**
   * @description
   */
  private readonly SOCIALS: Array<{[key: string]: string}> = [
    { github: 'https://i.ibb.co/Hq6W16r/github.png' },
    { youtube: 'https://i.ibb.co/NSqy5pf/youtube.png' },
    { pinterest: 'https://i.ibb.co/Px9MD9c/pinterest.png' },
    { linkedin: 'https://i.ibb.co/vQXvN73/linkedin.png' },
    { instagram: 'https://i.ibb.co/PMYPdQ8/instagram.png' },
    { twitter: 'https://i.ibb.co/pJ8nxnS/twitter.png' },
    { facebook: 'https://i.ibb.co/wSZ1ks0/faceboook.png' }
  ];

  /**
   * @description
   */
  private readonly COLORS: Array<{key: string, value: string}> = [
    { key: '111111', value: Container.configuration.consumer.theme.primaryColor },
    { key: '222222', value: Container.configuration.consumer.theme.secondaryColor },
    { key: '333333', value: Container.configuration.consumer.theme.tertiaryColor },
    { key: '444444', value: Container.configuration.consumer.theme.quaternaryColor },
    { key: 'fffff1', value: Color(`#${Container.configuration.consumer.theme.primaryColor}`).lighten(0.50).hex().substring(1) },
    { key: 'fffff2', value: Color(`#${Container.configuration.consumer.theme.secondaryColor}`).lighten(0.50).hex().substring(1) },
    { key: 'fffff3', value: Color(`#${Container.configuration.consumer.theme.tertiaryColor}`).lighten(0.50).hex().substring(1) },
    { key: 'fffff4', value: Color(`#${Container.configuration.consumer.theme.quaternaryColor}`).lighten(0.50).hex().substring(1) },
    { key: '000001', value: Color(`#${Container.configuration.consumer.theme.primaryColor}`).darken(0.50).hex().substring(1) },
    { key: '000002', value: Color(`#${Container.configuration.consumer.theme.secondaryColor}`).darken(0.50).hex().substring(1) },
    { key: '000003', value: Color(`#${Container.configuration.consumer.theme.tertiaryColor}`).darken(0.50).hex().substring(1) },
    { key: '000004', value: Color(`#${Container.configuration.consumer.theme.quaternaryColor}`).darken(0.50).hex().substring(1) }
  ];

  constructor() {
    Hbs.handlebars.registerHelper('year', () => {
      return new Date().getFullYear();
    });
  }

  /**
   * @description
   */
  static get(): Compiler {
    if(!Compiler.instance) {
      Compiler.instance = new Compiler();
    }
    return Compiler.instance;
  }

  /**
   * @description
   *
   * @param event
   * @param data
   *
   * @todo LOW :: do better about socials and banner
   */
  compile(event: string, data: Record<string,unknown>): { text: string, html: string } {

    if (Container.configuration.consumer.socials) {
      Container.configuration.consumer.socials.map(social => {
        social.icon = this.SOCIALS.find(s => s[social.name])[social.name];
      });
    }

    data.banner = this.getBanner(event);

    Hbs.handlebars.registerPartial('header', Hbs.handlebars.compile( readFileSync(`${process.cwd()}${this.PARTIALS}/header.hbs`, { encoding: 'utf-8' } ))(Container.configuration.consumer))
    Hbs.handlebars.registerPartial('body', Hbs.handlebars.compile( readFileSync(`${process.cwd()}${this.BLOCKS}/${this.getSegment(event)}.hbs`, { encoding: 'utf-8' } ))(data))
    Hbs.handlebars.registerPartial('footer', Hbs.handlebars.compile( readFileSync(`${process.cwd()}${this.PARTIALS}/footer.hbs`, { encoding: 'utf-8' } ))(Container.configuration.consumer))

    const html = Hbs.handlebars.compile( readFileSync(`${process.cwd()}${this.LAYOUT}`, { encoding: 'utf-8' } ) )(data);

    return {
      text: this.textify(html),
      html: this.customize(html)
    }
  }

  /**
   * @description
   *
   * @param html
   */
  textify(html: string): string {
    return htmlToText(html, {}) as string;
  }

  /**
   * @description
   *
   * @param event
   */
   private getBanner(event: string) {
    return this.TEMPLATES.find(template => template.event === event).banner || 'http://placehold.it/600x300';
  }

  /**
   * @description
   *
   * @param event
   */
  private getSegment(event: string) {
    return this.TEMPLATES.find(template => template.event === event).default ? 'default' : event;
  }

  /**
   * @description
   *
   * @param html
   */
  private customize(html: string): string {
    return this.COLORS.reduce( (acc, current) => {
      return acc.replace(new RegExp(current.key, 'g'), current.value);
    }, html);
  }
}

const service = Compiler.get();

export { service as Compiler }