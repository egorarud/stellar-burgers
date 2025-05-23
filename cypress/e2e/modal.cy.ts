import ingredients from '../fixtures/ingredients.json';

describe('тест модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      body: ingredients
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открытие ингредиента', () => {
    const ingredient = ingredients.data.find((item) => item.type === 'main');
    cy.get(`[data-cy="ingredient-${ingredient?._id}"]`).click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-name"]').should('contain', ingredient!.name);
  });

  it('закрытие по клику на крестик', () => {
    const ingredient = ingredients.data.find((item) => item.type === 'main');
    cy.get(`[data-cy="ingredient-${ingredient?._id}"]`).click({ force: true });
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрытие по клику на оверлей', () => {
    const ingredient = ingredients.data.find((item) => item.type === 'main');
    cy.get(`[data-cy="ingredient-${ingredient?._id}"]`).click({ force: true });
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
