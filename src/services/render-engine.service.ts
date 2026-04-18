import { readFileSync } from 'node:fs';

import Color from 'color';
import * as Hbs from 'hbs';
import { convert } from 'html-to-text';

import { Container } from '@services/container.service';

/**
 * @description Light render engine embedding on the fly an hbs compilation middleware.
 */
class RenderEngine {
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
   * @description TODO: find / remember what this fucking default property is
   */
   public readonly TEMPLATES: Array<{[key: string]: string|boolean}> = [
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

  private getColors(): Record<string, string> {
    const t = Container.configuration?.placeholders?.theme;
    const lighten = (hex: string) => Color(`#${hex}`).lighten(0.50).hex().substring(1);
    const darken  = (hex: string) => Color(`#${hex}`).darken(0.50).hex().substring(1);
    return {
      primaryColor:          t?.primaryColor    || '111111',
      secondaryColor:        t?.secondaryColor  || '222222',
      tertiaryColor:         t?.tertiaryColor   || '333333',
      quaternaryColor:       t?.quaternaryColor || '444444',
      primaryColorLight:     t?.primaryColor    ? lighten(t.primaryColor)    : 'fffff1',
      secondaryColorLight:   t?.secondaryColor  ? lighten(t.secondaryColor)  : 'fffff2',
      tertiaryColorLight:    t?.tertiaryColor   ? lighten(t.tertiaryColor)   : 'fffff3',
      quaternaryColorLight:  t?.quaternaryColor ? lighten(t.quaternaryColor) : 'fffff4',
      primaryColorDark:      t?.primaryColor    ? darken(t.primaryColor)     : '000001',
      secondaryColorDark:    t?.secondaryColor  ? darken(t.secondaryColor)   : '000002',
      tertiaryColorDark:     t?.tertiaryColor   ? darken(t.tertiaryColor)    : '000003',
      quaternaryColorDark:   t?.quaternaryColor ? darken(t.quaternaryColor)  : '000004',
    };
  }

  constructor() {
    Hbs.handlebars.registerHelper('year', () => {
      return new Date().getFullYear();
    });
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
    const colors = this.getColors();
    const company = Container.configuration?.placeholders?.company;

    if (company?.socials) {
      company.socials.forEach(social => {
        social.icon = this.SOCIALS.find(s => s[social.name])![social.name];
      });
    }

    data.banner = this.getBanner(event);

    const companyData = { ...company, ...colors };

    Hbs.handlebars.registerPartial('header', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.PARTIALS}/header.hbs`, { encoding: 'utf-8' } ))(companyData))
    Hbs.handlebars.registerPartial('body', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.BLOCKS}/${this.getSegment(event)}.hbs`, { encoding: 'utf-8' } ))(data))
    Hbs.handlebars.registerPartial('footer', Hbs.handlebars.compile( readFileSync(`${__dirname}${this.PARTIALS}/footer.hbs`, { encoding: 'utf-8' } ))(companyData))

    const html = Hbs.handlebars.compile( readFileSync(`${__dirname}${this.LAYOUT}`, { encoding: 'utf-8' } ) )({ ...data, ...colors });

    return {
      text: this.textify(html),
      html,
    }
  }

  /**
   * @description
   *
   * @param html
   */
  textify(html: string): string {
    return convert(html, {}) as string;
  }

  /**
   * @description
   *
   * @param event
   */
   private getBanner(event: string) {
    return this.TEMPLATES.find(template => template.event === event)?.banner || 'https://cdn.konfer.be/images/cliam/default/default-thumbnail.jpg'; // 600x300
  }

  /**
   * @description
   *
   * @param event
   */
  private getSegment(event: string) {
    return this.TEMPLATES.find(template => template.event === event)?.default ? 'default' : event;
  }
}

const service = new RenderEngine();

export { service as RenderEngine }
