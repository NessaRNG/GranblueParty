function getHead(vm) {
  // components can simply provide a `title` option
  // which can be either a string or a function
  const { head } = vm.$options

  if (head) {
    return head;
  }
}

function getKeywords(head) {
  if (head.keywords) {
    return DEFAULT_KEYWORDS + ', ' + head.keywords;
  }
  return DEFAULT_KEYWORDS;
}

const DEFAULT_TITLE = 'Granblue.Party - Granblue Fantasy Tools';
const DEFAULT_DESC = 'A collection of useful tools for Granblue Fantasy';
const DEFAULT_IMAGE = 'https://www.granblue.party/img/preview_party.png';
const DEFAULT_KEYWORDS = 'Granblue Fantasy, GBF, Cygames, tools';

function changeDocument(vm) {
  const head = getHead(vm)
  if (head) {
    document.title = head.title || DEFAULT_TITLE;
    document.querySelector('meta[name="title"]').setAttribute('content', head.title || DEFAULT_TITLE);
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', head.title || DEFAULT_TITLE);
    document.querySelector('meta[property="og:title"]').setAttribute('content', head.title || DEFAULT_TITLE);

    document.querySelector('meta[name="description"]').setAttribute('content', head.desc || DEFAULT_DESC);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', head.desc || DEFAULT_DESC);
    document.querySelector('meta[property="og:description"]').setAttribute('content', head.desc || DEFAULT_DESC);

    document.querySelector('meta[name="twitter:image"]').setAttribute('content', head.image || DEFAULT_IMAGE);
    document.querySelector('meta[property="og:image"]').setAttribute('content', head.image || DEFAULT_IMAGE);

    document.querySelector('meta[name="keywords"]').setAttribute('content', getKeywords(head));
  }
}

// SPA mode: always use the client-side mixin (no SSR context)
export default {
  mounted() {
    changeDocument(this);
  },
  watch: {
    '$route.path'() {
      changeDocument(this);
    }
  }
}