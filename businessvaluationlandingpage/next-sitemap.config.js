/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://businesslandingpage-m5j6.vercel.app',
  generateRobotsTxt: true,
  // optional configurations...
  exclude: ['/admin/*'],
} 