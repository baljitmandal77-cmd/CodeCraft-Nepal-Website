import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],

  actions: [
    {
      text: "Let's Talk",
      href: getPermalink('/contact'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Our Services',
      links: [
        { text: 'Website Development', href: '/services' },
        { text: 'Software Development', href: '/services' },
        { text: 'Mobile App Development', href: '/services' },
        { text: 'Cyber Security', href: '/services' },
        { text: 'Cloud Hosting', href: '/services' },
        { text: 'Digital Marketing', href: '/services' },
      ],
    },

    {
      title: 'Quick Links',
      links: [
        { text: 'Home', href: '/' },
        { text: 'About Us', href: '/about' },
        { text: 'Services', href: '/services' },
        { text: 'Contact', href: '/contact' },
      ],
    },

    {
      title: 'Contact',
      links: [
        { text: '📍 Janakpurdham, Nepal', href: '#' },
        { text: '📞 +977 9807618948', href: 'tel:+9779807618948' },
        { text: '💬 WhatsApp', href: 'https://wa.me/9779807618948', target: '_blank' },
      ],
    },
  ],

  secondaryLinks: [
    {
      text: 'Privacy Policy',
      href: '/privacy',
    },
    {
      text: 'Terms & Conditions',
      href: '/terms',
    },
  ],

  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://facebook.com/',
    },
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://instagram.com/',
    },
    {
      ariaLabel: 'LinkedIn',
      icon: 'tabler:brand-linkedin',
      href: 'https://linkedin.com/',
    },
    {
      ariaLabel: 'WhatsApp',
      icon: 'tabler:brand-whatsapp',
      href: 'https://wa.me/9779807618948',
    },
  ],

  footNote: `
    <strong>Infinity Code Labs</strong><br>
    Janakpurdham, Nepal<br>
    Phone / WhatsApp:
    <a href="https://wa.me/9779807618948" target="_blank">+977 9807618948</a><br><br>

    © ${new Date().getFullYear()} Infinity Code Labs. All Rights Reserved.<br>
    Designed & Developed by <strong>Infinity Code Labs</strong>
  `,
};
