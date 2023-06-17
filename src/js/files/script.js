// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';

//========================================================================================================================================================
// scroll for header //

const header = document.querySelector('header'),
  headerRight = document.querySelector('.header__right'),
  introInner = document.querySelector('.intro__inner');

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    header.classList.add('header--scrolled');
    headerRight.classList.add('header__right--scrolled');
    introInner.classList.add('intro__inner--scrolled');
  } else {
    header.classList.remove('header--scrolled');
    headerRight.classList.remove('header__right--scrolled');
    introInner.classList.remove('intro__inner--scrolled');
  }
});
