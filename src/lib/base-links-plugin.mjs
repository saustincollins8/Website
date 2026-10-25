// A Markdown plugin that prefixes root-relative links and images (e.g.
// "/files/cv.pdf", as Pages CMS writes them) with the base path the site is
// served from. External links, protocol-relative URLs and relative paths are
// left alone.

/** @param {string} base */
export default function baseLinksPlugin(base) {
  const prefix = base.replace(/\/?$/, '/');

  return {
    name: 'base-links',
    element: {
      filter: ['a', 'img'],
      /** @param {any} node @param {any} ctx */
      visit(node, ctx) {
        for (const attribute of ['href', 'src']) {
          const value = node.properties?.[attribute];
          if (typeof value === 'string' && /^\/(?!\/)/.test(value)) {
            ctx.setProperty(node, attribute, prefix + value.slice(1));
          }
        }
      },
    },
  };
}
