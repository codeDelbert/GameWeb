const items = document.querySelectorAll('.nav--header-1 > .nav__item');
const rootElement = document.querySelector('.layout');

const colors = [
  'hsla(14, 97%, 65%, 0.4)',
];

const state = {
  navigationItems: {},
  root: rootElement,
};

for (let navItemIndex = 0; navItemIndex < items.length; ++navItemIndex) {
  const stateItem = {
    color: colors[navItemIndex % colors.length],
    element: items[navItemIndex],
    id: navItemIndex,
    isActive: false,
    type: 'DEFAULT',
  } 
  
  const subNav =  items[navItemIndex].querySelector('.nav');
  if (subNav) {
    stateItem.childNavigation = subNav;
    stateItem.type = 'PARENT';
  }
  
  stateItem.onClick = (event) => {
    const actualOnClick = () => {
      if (state.activeItem === navItemIndex) {
        return;
      }
      
      if (state.activeItem) {
        state.activeItem = null;
      } 

      if ('PARENT' === state.navigationItems[navItemIndex].type) {
        // Set new active item.
        state.activeItem = navItemIndex;

        animateShow(state);
      }
    };
    
    if (state.activeItem) {
      return animateHide(state, actualOnClick);
    }
    
    return actualOnClick();
  };
  
  state.navigationItems[navItemIndex] = stateItem;
}

const animateShow = (state) => {
  const animation = timeline();
  console.log(state.navigationItems[state.activeItem]);
  
  animation.add({
    backgroundColor: state.navigationItems[state.activeItem].color,
    begin: () => {
      state.root.classList.add('nav--active');
    },
    complete: () => {
      state.navigationItems[state.activeItem].element.classList.add('nav__item--active');
    },
    duration: 450,
    easing: 'easeOutExpo',
    opacity: 1,
    translateX: [
      {delay: 300, value: '270px',},
    ],
    scaleX: [
      {value: 0},
      {value: 1},
    ],
    targets: '.layout__frontdrop',
  })
  .add({
    duration: 70,
    opacity: [0, 1],
    targets: state.navigationItems[state.activeItem].childNavigation,
  }).add({
    delay: stagger(70),
    opacity: [0, 1],
    translateY: ['100%', '0'],
    targets: state.navigationItems[state.activeItem].childNavigation.querySelectorAll('.nav__item'),
  });
  
  return animation;
};

const animateHide = (state, complete) => {
  const animation = timeline({
    complete: complete,
  });
  
  animation.add({
    duration: 210,
    opacity: [1, 0],
    translateY: [0, '+=50px'],
    targets: state.navigationItems[state.activeItem].childNavigation,
  }).add({
    complete: () => {
      state.root.classList.remove('nav--active');
      state
        .navigationItems[state.activeItem]
        .element
        .classList
        .remove('nav__item--active')
      ;
    },
    duration: 250,
    easing: 'easeOutCirc',
    scaleX: [
      {value: 0,},
    ],
    translateX: [
      {value: 0},
    ],
    targets: '.layout__frontdrop',
  });
  
  return animation;
};

(() => {
  const introAnimation = timeline({
    complete: () => {
      for (let stateItemIndex = 0; stateItemIndex < Object.values(state.navigationItems).length; ++ stateItemIndex) {
        state.navigationItems[stateItemIndex].element.addEventListener(
          'click',
          state.navigationItems[stateItemIndex].onClick
        );
        
        state.navigationItems[stateItemIndex].element.style.transform = '';
      }
    },
  });

  introAnimation.add({
    duration: 350,
    delay: 1000,
    easing: 'easeOutCirc',
    targets: '.layout__backdrop',
    scaleX: [0, 1],
  }).add({
    delay: stagger(75),
    duration: 450,
    easing: 'easeOutCirc',
    opacity: [0, 1],
    translateY: ['100%', '0%'],
    targets: '.nav--header-1 > .nav__item:not(.nav__item--home)',
  }).add({
    easing: 'easeOutExpo',
    targets: '.layout__backdrop',
    translateX: [
      {delay: 350, value: (67) + '%'},
    ],
  }).add({
    duration: 350,
    easing: 'easeOutExpo',
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: ['50px', '0'],
  }).add({
    duration: 350,
    easing: 'easeOutExpo',
    targets: '.hero-text',
    opacity: [0, 1],
    translateY: ['0', '-3rem'],
  }, '-=100');
})();