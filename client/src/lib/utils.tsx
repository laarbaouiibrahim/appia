import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

interface TabContentProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
}

export function TabContent({ id, active, children }: TabContentProps) {
  return (
    <div id={`${id}-tab`} className={active ? 'active' : 'hidden'}>
      {children}
    </div>
  );
}

// HTML sanitizer function to safely render HTML in preview
export function sanitizeHtml(html: string): string {
  // This is a very basic sanitizer, in a production app you'd use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
}

// Create a sample email template
export const defaultEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monthly Newsletter</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Monthly Newsletter</h1>
      <p>The latest updates from our team</p>
    </div>
    <div class="content">
      <h2>Hello {{first_name}},</h2>
      <p>We hope this email finds you well. Here are our latest updates:</p>
      
      <h3>New Features</h3>
      <ul>
        <li>Improved email deliverability</li>
        <li>New templates gallery</li>
        <li>Enhanced analytics dashboard</li>
      </ul>
      
      <p>Click the button below to learn more about these exciting new features.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{cta_link}}" style="background-color: #1976d2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Learn More</a>
      </div>
      
      <p>Best regards,<br>The Team</p>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

// PowerMTA sample configuration
export const samplePmtaConfig = `# PowerMTA Configuration File
# Server: mail-01.example.com

# Global Options
http-mgmt-port 8080
http-access 127.0.0.1 monitor
http-access 192.168.1.0/24 monitor

# Logging
log-file /var/log/pmta/pmta.log
log-format common
accounting-log-file /var/log/pmta/acct.csv
accounting-format extended

# SMTP Settings
smtp-server-port 25
smtp-server-tls-port 465
max-smtp-in 20
max-smtp-out 100
smtp-greeting-delay 1s

# Queues and Resources
max-queue-size 1000MB
queue-file /var/spool/pmta/queue
spool-dir /var/spool/pmta/spool
max-connection-rate /min

# Domain Definitions
domain-macro local-domains example.com,mail.example.com

# Source Definitions
source {
    smtp-source-host 192.168.1.10 mail-01.example.com
    max-msg-rate 100/h
    max-connect-rate 10/min
    max-message-size 35M
    default-mta 0
}

# Domain Specific Settings
domain * {
    max-msg-rate 100/h
    smtp-pattern-list retry-patterns
    retry-after 10m
    max-connect-rate 10/min
}

# Specific Routing
<domain gmail.com>
    smtp-source-ip 192.168.1.10
    max-msg-rate 50/h
</domain>

# Pattern Lists
<pattern-list retry-patterns>
    reply /4\\d\\d/ mode=temp
    reply /5\\d\\d/ mode=perm
</pattern-list>

# End of Configuration`;
