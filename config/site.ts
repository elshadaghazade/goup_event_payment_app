export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Mediplatform gateway app",
  description:
    "Mediplatform",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Doc",
      href: "/api-doc",
    },
  ],
  links: {
    twitter: "https://twitter.com/mediplatform",
    github: "https://github.com/mediplatform",
    docs: "/api-doc",
  },
}
