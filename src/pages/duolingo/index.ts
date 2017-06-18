
const DUOLINGO = 'https://www.duolingo.com'

const SELECTORS = {
  profileLanguageSelector: '.profile-language',
  languageNameSelector: '.language-name',
  statSelector: '.substat'
}

interface Language {
  name: string
  nextLevel: string
  total: string
}

export interface Profile {
  userName: string
  languages: Language[]
}

export interface ProfileSelector {
  profileLanguageSelector: string
  languageNameSelector: string
  statSelector: string
}

const createProfileExpression = ({
  profileLanguageSelector,
  languageNameSelector,
  statSelector }: ProfileSelector
) =>
  `const d = new Promise((resolve) => {
    resolve([...document.querySelectorAll('${profileLanguageSelector}')]
      .map(l => ({
        name: l.querySelector('${languageNameSelector}').innerHTML,
        nextLevel: l.querySelectorAll('${statSelector}')[0].innerHTML,
        total: l.querySelectorAll('${statSelector}')[1].innerHTML
      })));
  });
  d.then(res => JSON.stringify(res));`

export const profileExpression = createProfileExpression(SELECTORS)
export const profileAddr = (userName: string) => `${DUOLINGO}/${userName}`
