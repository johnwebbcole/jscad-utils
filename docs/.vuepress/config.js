// auto generated sidebar
const { fileTree } = require('../code/config');
console.log('foo', fileTree);
module.exports = {
  dest: 'public',
  locales: {
    '/': {
      title: 'JsCad Utils',
      description: 'Generate jsdoc markdown files for vuepress'
    }
  },

  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-135958052-3'
      }
    ]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API', link: '/code/' },
      { text: 'GitLab', link: 'https://gitlab.com/johnwebbcole/jscad-utils' }
    ],
    displayAllHeaders: true,
    editLinks: true,
    sidebarDepth: 3,
    docsDir: 'code',
    sidebar: [
      ['/', 'Readme'],
      //   {
      //     title: 'Home',
      //     path: '/',
      //     collapsable: false,
      //     children: [['/', 'Readme']]
      //   },
      {
        title: 'Code',
        path: '/code/',
        collapsable: false,
        children: fileTree.map(api => `/code${api.path}`)
      }
    ]
  }
};
