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
  private readonly THEME = Container.configuration.consumer?.theme;

  /**
   * @description
   */
  private readonly LAYOUT: string = '/../../src/views/layouts/default.hbs';

  /**
   * @description
   */
  private readonly PARTIALS: string = '/../../src/views/partials';

  /**
   * @description
   */
  private readonly BLOCKS: string = '/../../src/views/blocks';

  /**
   * @description
   */
   private readonly TEMPLATES: Array<{[key: string]: string|boolean}> = [
    { event: 'default', banner: '', default: true },
    { event: 'event.subscribe', banner: 'https://cdn.konfer.be/images/cliam/banners/event.png', default: true },
    { event: 'event.unsubscribe', banner: 'https://cdn.konfer.be/images/cliam/banners/event.png', default: true },
    { event: 'event.updated', banner: 'https://cdn.konfer.be/images/cliam/banners/event.png', default: true },
    { event: 'order.invoice', banner: 'https://cdn.konfer.be/images/cliam/banners/invoice.png' },
    { event: 'order.progress', banner: 'https://cdn.konfer.be/images/cliam/banners/progress.png' },
    { event: 'order.shipped', banner: 'https://cdn.konfer.be/images/cliam/banners/shhipped.png' },
    { event: 'password.request', banner: 'https://cdn.konfer.be/images/cliam/banners/password.png', default: true },
    { event: 'password.updated', banner: 'https://cdn.konfer.be/images/cliam/banners/password.png', default: true },
    { event: 'user.invite', banner: 'https://cdn.konfer.be/images/cliam/banners/invite.png' },
    { event: 'user.contact', banner: 'https://cdn.konfer.be/images/cliam/banners/contact.png', default: true },
    { event: 'user.progress', banner: 'https://cdn.konfer.be/images/cliam/banners/progress.png' },
    { event: 'user.survey', banner: 'https://cdn.konfer.be/images/cliam/banners/survey.png' },
    { event: 'user.welcome', banner: 'https://cdn.konfer.be/images/cliam/banners/welcome.png', default: true },
    { event: 'user.bye', banner: 'https://cdn.konfer.be/images/cliam/banners/leave.png', default: true },
    { event: 'user.confirm', banner: 'https://cdn.konfer.be/images/cliam/banners/confirm.png', default: true }
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
    { key: '111111', value: this.THEME?.primaryColor || null },
    { key: '222222', value: this.THEME?.secondaryColor || null },
    { key: '333333', value: this.THEME?.tertiaryColor || null },
    { key: '444444', value: this.THEME?.quaternaryColor || null },
    { key: 'fffff1', value: this.THEME?.primaryColor ? Color(`#${this.THEME.primaryColor}`).lighten(0.50).hex().substring(1) : null },
    { key: 'fffff2', value: this.THEME?.secondaryColor ? Color(`#${this.THEME.secondaryColor}`).lighten(0.50).hex().substring(1) : null },
    { key: 'fffff3', value: this.THEME?.tertiaryColor ? Color(`#${this.THEME.tertiaryColor}`).lighten(0.50).hex().substring(1) : null },
    { key: 'fffff4', value: this.THEME?.quaternaryColor ? Color(`#${this.THEME.quaternaryColor}`).lighten(0.50).hex().substring(1) : null },
    { key: '000001', value: this.THEME?.primaryColor ? Color(`#${this.THEME.primaryColor}`).darken(0.50).hex().substring(1) : null },
    { key: '000002', value: this.THEME?.secondaryColor ? Color(`#${this.THEME.secondaryColor}`).darken(0.50).hex().substring(1) : null },
    { key: '000003', value: this.THEME?.tertiaryColor ? Color(`#${this.THEME.tertiaryColor}`).darken(0.50).hex().substring(1) : null },
    { key: '000004', value: this.THEME?.quaternaryColor ? Color(`#${this.THEME.quaternaryColor}`).darken(0.50).hex().substring(1) : null }
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

    Hbs.handlebars.registerPartial('header', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.PARTIALS}/header.hbs`, { encoding: 'utf-8' } ))(Container.configuration.consumer))
    Hbs.handlebars.registerPartial('body', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.BLOCKS}/${this.getSegment(event)}.hbs`, { encoding: 'utf-8' } ))(data))
    Hbs.handlebars.registerPartial('footer', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.PARTIALS}/footer.hbs`, { encoding: 'utf-8' } ))(Container.configuration.consumer))

    const html = Hbs.handlebars.compile( readFileSync(`${__dirname}${this.LAYOUT}`, { encoding: 'utf-8' } ) )(data);

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
    return this.TEMPLATES.find(template => template.event === event).banner || 'https://cdn.konfer.be/images/cliam/default/default-thumbnail.jpg'; // 600x300
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