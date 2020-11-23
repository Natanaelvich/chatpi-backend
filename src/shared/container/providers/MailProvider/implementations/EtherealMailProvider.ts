/* eslint-disable no-console */
import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import ITemplateMailProvider from '../../TemplateMailProvider/models/ITemplateMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('TemplateMailProvider')
    private templateMailProvider: ITemplateMailProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    subject,
    templateData,
    to,
    from,
  }: ISendMailDTO): Promise<void> {
    const responseMessage = await this.client.sendMail({
      from: {
        name: from?.name || '[Equipe] Gobarber',
        address: from?.email || 'natanaelima@mundotech.dev',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.templateMailProvider.parse(templateData),
    });

    console.log('Message sent: %s', responseMessage.messageId);
    // Preview only available when sending through an Ethereal account
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(responseMessage),
    );
  }
}
