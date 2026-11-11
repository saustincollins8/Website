// Links to other sites and to PDFs open in a new tab, so visitors keep their
// place on this one; links within the site and email links don't. Components
// use `newTab` (re-exported from site.ts), and the Markdown plugin below
// applies the same rule to links typed in the editor.

/** Id of the hidden "Opens in a new tab" note in BaseLayout, read out by screen readers. */
export const NEW_TAB_NOTE = 'new-tab-note';

/** @param {string} href */
export function opensInNewTab(href) {
  return /^https?:\/\//i.test(href) || /\.pdf([?#]|$)/i.test(href);
}

/**
 * Attributes to spread onto a link: `<a href={url} {...newTab(url)}>`.
 * @param {string} href
 */
export function newTab(href) {
  return opensInNewTab(href)
    ? { target: '_blank', rel: 'noopener', 'aria-describedby': NEW_TAB_NOTE }
    : {};
}

/** A Markdown plugin that gives links in Markdown bodies the same attributes. */
export default function newTabLinksPlugin() {
  return {
    name: 'new-tab-links',
    element: {
      filter: ['a'],
      /** @param {any} node @param {any} ctx */
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string') return;
        for (const [key, value] of Object.entries(newTab(href))) {
          ctx.setProperty(node, key, value);
        }
      },
    },
  };
}
