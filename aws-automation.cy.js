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

    var passcode = "04067154";
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
    cy.visit(
      "https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#communityRaces"
    );
  });
});
