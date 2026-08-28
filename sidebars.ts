import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  devwaySidebar: [
    {
      type: 'category',
      label: '🚀 Pendahuluan',
      items: ['readme', 'architecture', 'project-structure'],
    },
    {
      type: 'category',
      label: '⚙️ Backend Architecture',
      items: ['backend', 'advanced'],
    },
    {
      type: 'category',
      label: '🎨 Frontend Architecture',
      items: ['frontend'],
    },
    {
      type: 'category',
      label: '📚 Stack-Specific',
      items: ['stack-specific'],
    },
    {
      type: 'category',
      label: '🛠️ Development & Deployment',
      items: ['development', 'deployment', 'testing'],
    },
    {
      type: 'category',
      label: '🤝 Kontribusi & Lainnya',
      items: ['contributing', 'faq', 'security', 'changelog', 'api'],
    },
  ],
};

export default sidebars;
