using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class EmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        using (var client = new SmtpClient(_emailSettings.SMTPHost, _emailSettings.SMTPPort))
        {
            client.Credentials = new NetworkCredential(_emailSettings.SMTPUsername, _emailSettings.SMTPPassword);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}

public class EmailSettings
{
    public string SMTPHost { get; set; }
    public int SMTPPort { get; set; }
    public string SMTPUsername { get; set; }
    public string SMTPPassword { get; set; }
    public string FromEmail { get; set; }
    public string FromName { get; set; }
}