import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'DevWay',
  tagline: 'Panduan Arsitektur Universal untuk Developer',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://devway.vercel.app',
  baseUrl: '/',

  organizationName: 'nohypelabs',
  projectName: 'devway',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'id',
    locales: ['id'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/nohypelabs/devway/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/nohypelabs/devway/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/devway-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'DevWay',
      logo: {
        alt: 'DevWay Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'devwaySidebar',
          position: 'left',
          label: 'Dokumentasi',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/nohypelabs/devway',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Pendahuluan',
              to: '/docs/readme',
            },
            {
              label: 'Backend',
              to: '/docs/backend',
            },
            {
              label: 'Frontend',
              to: '/docs/frontend',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/nohypelabs/devway',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/your-invite',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'CHANGELOG',
              to: '/docs/changelog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DevWay. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
