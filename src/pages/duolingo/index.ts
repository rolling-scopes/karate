
const DUOLINGO = 'https://www.duolingo.com';

const SELECTORS = {
  profileLanguageSelector: '.profile-language',
  languageNameSelector: '.language-name',
  statSelector: '.substat',
};

interface language {
  name: string;
  nextLevel: string;
  total: string;
}
export interface Profile {
  userName: string;
  languages: language[];
}
export interface ProfileSelector {
  profileLanguageSelector: string;
  languageNameSelector: string;
  statSelector: string;
}

const createProfileExpression = ({
  profileLanguageSelector,
  languageNameSelector,
  statSelector }: ProfileSelector,
) =>
  `JSON.stringify(
    [...document.querySelectorAll('${profileLanguageSelector}')]
      .map(l => ({
        name: l.querySelector('${languageNameSelector}').innerHTML,
        nextLevel: l.querySelectorAll('${statSelector}')[0].innerHTML,
        total: l.querySelectorAll('${statSelector}')[1].innerHTML
      }))
  );`;

export const profileExpression = createProfileExpression(SELECTORS);

export const profileAddr = (userName: string) => `${DUOLINGO}/${userName}`;
