function IDAlogin() {
  cy.origin("https://idag2.jpmorganchase.com", () => {
    Cypress.Commands.add("login", (username, password, region, passcode) => {
      cy.visit("https://bit.ly/35KqkKb");
      cy.get("#samAccountNameInput").type(username);

      cy.get("#passwordInput").type(password);

      cy.get("#domainInput").select(region).invoke("val").should("eq", region);

      cy.get("#submitButton").click();

      cy.get("#passcodeInput").type(passcode);
      cy.get("#submitButton").click();
    });

    cy.visit("https://bit.ly/35KqkKb");

    var passcode = "98266474";
    cy.login(
      Cypress.env("sid"),
      Cypress.env("pwd"),
      Cypress.env("region"),
      passcode
    );
  });
}

describe("AWS Evaluation", () => {
  it("passes", () => {
    cy.visit("https://us-east-1.console.aws.amazon.com");
    IDAlogin();

    var i = 0;
    var mock_array = Array.from({ length: 15 }, (v, k) => k + 1);
    cy.wrap(mock_array).each((index) => {
      i = index;
      submitModel();
    });
  });
});

function submitModel() {
  cy.visit(
    "https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#competition/arn%3Aaws%3Adeepracer%3A%3A091259800912%3Aleaderboard%2Fe9cbb89a-2aee-4c34-b312-95096ab05414/submitModel"
  );

  Cypress.on("uncaught:exception", (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false;
    }
  });

  cy.wait(10000);

  cy.get(
    'button[class*="awsui_button-trigger_18eso_7th4j_97 awsui_has-caret_18eso_7th4j_137"]'
  ).click();

  cy.contains("MUDR23-175-Model-975").click();

  cy.get(
    'button[class*="awsui_button_vjswe_r2ttg_101 awsui_variant-primary_vjswe_r2ttg_210"]'
  )
    .contains("Enter race")
    .click();

  cy.wait(10000);

  cy.visit(
    "https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#races/arn%3Aaws%3Adeepracer%3A%3A091259800912%3Aleaderboard%2Fe9cbb89a-2aee-4c34-b312-95096ab05414"
  );

  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;

  cy.wait(510000);
}
