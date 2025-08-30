import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Seb Goodman",
  EMAIL: "sebgoodman01@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Seb Goodman's personal website.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of blogs about tech and software development.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const CONTACT: Metadata = {
  TITLE: "Contact",
  DESCRIPTION: "Get in touch with me.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/seb-goodman",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/sebastian-goodman-641729133",
  },
  {
    NAME: "email",
    HREF: "/contact",
  },
];
