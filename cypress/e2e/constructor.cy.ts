import ingredients from '../fixtures/ingredients.json';

describe('добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      body: ingredients
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавление булки в конструктор', () => {
    const bun = ingredients.data.find((item) => item.type === 'bun');
    cy.get(`.add-${bun?._id}`).click({ force: true });
    cy.get('[data-cy="constructor-top"]').should('contain', bun!.name);
    cy.get('[data-cy="constructor-bottom"]').should('contain', bun!.name);
  });

  it('добавление начинки в конструктор', () => {
    const ingredient = ingredients.data.find((item) => item.type === 'main');
    cy.get(`.add-${ingredient?._id}`).click();
    cy.get('.constructor-ingredient')
      .should('exist')
      .should('contain', ingredient!.name);
  });
});
