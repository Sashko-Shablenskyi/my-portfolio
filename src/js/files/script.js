// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile, menuClose } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';

//========================================================================================================================================================
// scroll for header

const header = document.querySelector('header'),
  headerRight = document.querySelector('.header__right'),
  introInner = document.querySelector('.intro__inner');

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

//========================================================================================================================================================
//close meny by click on wrapper

const menuWrapper = document.querySelector('.menu');

menuWrapper.addEventListener('click', (e) => {
  e.target.className == 'header__menu menu' ? menuClose() : null;
});

//========================================================================================================================================================
// swap day-night

const dayRadioButton = document.getElementById('day'),
  nightRadioButton = document.getElementById('night');

dayRadioButton.addEventListener('change', () => {
  document.documentElement.style.setProperty('--bg-primary', '#ddd');
  document.documentElement.style.setProperty('--bg-primary_70', '#ddddddb3');
  document.documentElement.style.setProperty('--text-primary', '#000');
  document.documentElement.style.setProperty('--text-inverse', '#ffffff');
});

nightRadioButton.addEventListener('change', () => {
  document.documentElement.style.setProperty('--bg-primary', '#1f1f1f');
  document.documentElement.style.setProperty('--bg-primary_70', '#1f1f1fb3');
  document.documentElement.style.setProperty('--text-primary', '#ddd');
  document.documentElement.style.setProperty('--text-inverse', '#151515');
});

//========================================================================================================================================================
// freelancehunt

const token = 'ce9e23154ce91d84a9ccb95d64c183b95c481f01',
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

async function fetchFreelancerData() {
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

fetchFreelancerData();

function renderFreelanceStatistic(result) {
  const statisticBody = document.querySelector('.statistic__body');

  const template = `
    <div class="statistic__box box">
      <div class="box__value">${result.successful_projects}%</div>
      <div class="box__title">Successful projects</div>
    </div>
     <div class="statistic__box box">
      <div class="box__value">${result.average_score}/10</div>
      <div class="box__title">Average score</div>
    </div>
     <div class="statistic__box box">
      <div class="box__value">${result.rating}</div>
      <div class="box__title">Rating</div>
    </div>
     <div class="statistic__box box">
      <div class="box__value">${result.positive_reviews}/${result.negative_reviews}</div>
      <div class="box__title">Rreviews <br> positive/negative</div>
    </div>
  `;

  statisticBody.innerHTML = template;
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

//========================================================================================================================================================
//INPUT FOCUS

const form = document.querySelector('.contacts__form'),
  fields = form.querySelectorAll('input, textarea');

fields.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      input.classList.add('has-text');
    } else {
      input.classList.remove('has-text');
    }
  });
});
