import user from '../fixtures/user.json';
import order from '../fixtures/newOrder.json';
import ingredients from '../fixtures/ingredients.json';

describe('оформляем заказ', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user.user
      }
    }).as('getUser');

    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      body: ingredients
    }).as('getIngredients');

    cy.intercept(
      'POST',
      'https://norma.nomoreparties.space/api/orders',
      (req) => {
        req.reply({
          statusCode: 200,
          body: order
        });
      }
    ).as('order');

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token-456');
      cy.setCookie('accessToken', 'Bearer access-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('оформление заказа', () => {
    const ingredient = ingredients.data.find((item) => item.type === 'main');
    const bun = ingredients.data.find((item) => item.type === 'bun');

    cy.get(`.add-${ingredient?._id}`).click();
    cy.get(`.add-${bun?._id}`).click({ force: true });

    cy.get('[data-cy="order"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.wait('@order');

    cy.get('[data-cy="order-number"]').should('contain', order.order.number);

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('.constructor-ingredient').should('not.exist');
  });
});
