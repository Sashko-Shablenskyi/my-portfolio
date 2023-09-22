// Підключення функціоналу "Чертоги Фрілансера"
import Isotope from 'isotope-layout';
import { isMobile, menuClose } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';

//========================================================================================================================================================
// scroll for header

function scrollForBlocks() {
  const header = document.querySelector('header'),
    headerRight = document.querySelector('.header__right'),
    introInner = document.querySelector('.intro__inner');

  if (header && headerRight && introInner) {
    changeClassListByScroll(header, headerRight, introInner);
  } else {
    changeClassList(header, headerRight);
  }
}

scrollForBlocks();

function changeClassListByScroll(header, headerRight, introInner) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      header.classList.add('header--scrolled');
      headerRight.classList.add('header__right--scrolled');
      introInner.classList.add('intro__inner--scrolled');
    } else {
      header.classList.remove('header--scrolled');
      headerRight.classList.remove('header__right--scrolled');
      introInner.classList.remove('intro__inner--scrolled');
    }
  });
}

function changeClassList(header, headerRight) {
  header.classList.add('header--scrolled');
  headerRight.classList.add('header__right--scrolled');
}

//========================================================================================================================================================
//close meny by click wrapper or link

function closeMenu() {
  const menuBG = document.querySelector('.menu__bg');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  menuBG.addEventListener('click', () => {
    menuClose();
  });

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menuClose();

      const target = document.querySelector(link.getAttribute('href'));

      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 110;

        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    });
  });
}

closeMenu();

//========================================================================================================================================================
// freelancehunt

function checkExistStatistic() {
  const statistic = document.querySelector('.statistic');

  if (statistic) {
    const token = '08094e74cb53285ea5b784cf0045098eb901ca80',
      urlProfile = `https://api.freelancehunt.com/v2/my/profile`,
      urlReviews = `https://api.freelancehunt.com/v2/freelancers/811385/reviews`;

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const freelancerData = {};

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetchFreelancerData(urlProfile, urlReviews, freelancerData, requestOptions);
  }
}

checkExistStatistic();

async function fetchFreelancerData(
  urlProfile,
  urlReviews,
  freelancerData,
  requestOptions
) {
  try {
    const profileResponse = await fetch(urlProfile, requestOptions);
    const profileResult = await profileResponse.json();

    const data = profileResult.data.attributes;

    freelancerData.rating = data.rating;
    freelancerData.positive_reviews = data.positive_reviews;
    freelancerData.negative_reviews = data.negative_reviews;

    const reviewsResponse = await fetch(urlReviews, requestOptions);
    const reviewsResult = await reviewsResponse.json();

    freelancerData.average_score = calculateAverageScore(reviewsResult);
    freelancerData.successful_projects =
      calculateSuccessfulProjects(reviewsResult);

    renderFreelanceStatistic(freelancerData);
  } catch (error) {
    console.log('error', error);
  }
}

function renderFreelanceStatistic(result) {
  const statisticBody = document.querySelector('.statistic__body'),
    percent = statisticBody.querySelector('.percent'),
    average = statisticBody.querySelector('.average'),
    rating = statisticBody.querySelector('.rating'),
    reviews = statisticBody.querySelector('.reviews');

  percent.innerHTML = `${result.successful_projects}%`;
  average.innerHTML = `${result.average_score}/10`;
  rating.innerHTML = `${result.rating}`;
  reviews.innerHTML = `${result.positive_reviews}/${result.negative_reviews}`;

  hideLoader();
  showStatisticBoxes();
}

function calculateAverageScore(reviews) {
  const result = reviews.data.reduce(
    (accumulator, elem) => {
      const averageGrade = elem.attributes.grades.total;
      accumulator.total += averageGrade;
      accumulator.count++;
      return accumulator;
    },
    { total: 0, count: 0 }
  );

  return result.count > 0 ? result.total / result.count : 0;
}

function calculateSuccessfulProjects(reviewsResult) {
  const result = reviewsResult.data.reduce(
    (accumulator, elem) => {
      const averageGrade = elem.attributes.project.status.id;

      if (averageGrade == '21') {
        accumulator.total++;
        accumulator.count++;
        return accumulator;
      }
    },
    { total: 0, count: 0 }
  );

  return result.total > 0 ? (result.total / result.count) * 100 : 0;
}

function hideLoader() {
  const loader = document.querySelector('.statistic__loader');
  loader.classList.add('statistic__loader--hidden');
}

function showStatisticBoxes() {
  const boxes = [...document.querySelectorAll('.statistic__box')];

  boxes.forEach((e) => {
    e.classList.remove('statistic__box--hidden');
  });
}

//========================================================================================================================================================
//INPUT FOCUS

function addFocusToForm() {
  const fields = document.querySelectorAll('input, textarea');

  if (fields) {
    fields.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.value.trim() !== '') {
          input.classList.add('has-text');
        } else {
          input.classList.remove('has-text');
        }
      });
    });
  }
}

addFocusToForm();

//========================================================================================================================================================
// ARTICLES
const articles = document.querySelector('.articles-page');

if (articles) {
  // filterArticles();
  imagesInit();
  gridInit();
}

// function filterArticles() {
//   const filterBtns = document.querySelectorAll('.filter__btn'),
//     articles = document.querySelectorAll('.articles__item');

//   filterBtns.forEach((btn) => {
//     btn.addEventListener('click', function () {
//       const filterValue = btn.getAttribute('data-filter');

//       articles.forEach((article) => {
//         const articleFilter = article.getAttribute('data-filter');
//         if (filterValue === '*' || filterValue === articleFilter) {
//           article.classList.add('article--active');
//         } else {
//           article.classList.remove('article--active');
//         }
//       });

//       filterBtns.forEach((btn) => {
//         btn.classList.remove('filter__btn--active');
//       });
//       btn.classList.add('filter__btn--active');
//     });
//   });
// }

function imagesInit() {
  const images = document.querySelectorAll('.article__img');

  if (images.length) {
    images.forEach((image) => {
      const imageItem = image.querySelector('img');
      const padding =
        (imageItem.offsetHeight / imageItem.offsetWidth) * 0.75 * 100;
      image.style.paddingBottom = `${padding}%`;
      imageItem.classList.add('init');
    });
  }
}

function gridInit(params) {
  const isotope = document.querySelector('.articles__wrapper');
  const isotopeGrid = new Isotope(isotope, {
    itemSelector: '.articles__item',
    layoutMode: 'masonry',
    masonry: {
      columnWidth: '.articles__item',
      gutter: 15,
    },
  });
}

//========================================================================================================================================================
// ISOTOPE
