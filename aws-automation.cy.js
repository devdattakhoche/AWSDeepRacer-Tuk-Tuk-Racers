function IDAlogin() {
  const ida_domain = "https://idag2.jpmorganchase.com";
  cy.origin(ida_domain, () => {
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

    var passcode = "57416234";
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
    const aws_domain = "https://us-east-1.console.aws.amazon.com";
    cy.visit(aws_domain);
    IDAlogin();

    var i = 0;
    var mock_array = Array.from({ length: 1000 }, (v, k) => k + 1);
    cy.wrap(mock_array).each((index) => {
      i = index;
      submitModel();
    });
  });
});

function submitModel() {
  var models = ["071", "0068", "068"];
  cy.wrap(models).each((model) => {
    __submitModel(model);
  });
}

function __submitModel(model) {
  ////// Constants and links to be visited

  const race_submitting_link =
    "https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#competition/arn%3Aaws%3Adeepracer%3A%3A091259800912%3Aleaderboard%2F3e606de6-deba-4fde-b11e-e62c3a0602e5/submitModel";
  const race_leaderboard =
    "https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#races/arn%3Aaws%3Adeepracer%3A%3A091259800912%3Aleaderboard%2F3e606de6-deba-4fde-b11e-e62c3a0602e5";
  const enter_race_button =
    'button[class*="awsui_button_vjswe_r2ttg_101 awsui_variant-primary_vjswe_r2ttg_210"]';
  const model_list =
    'button[class*="awsui_button-trigger_18eso_7th4j_97 awsui_has-caret_18eso_7th4j_137"]';
    
  const model_prefix = "MUDR23-175-Model-";

  cy.visit(race_submitting_link);

  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
  Cypress.on("uncaught:exception", (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false;
    }
  });

  cy.wait(10000);

  cy.get(model_list).click();

  cy.contains(new RegExp(`^${model_prefix.concat(model)}$`, "g")).click();

  cy.get(enter_race_button).contains("Enter race").click();

  cy.wait(10000);

  cy.visit(race_leaderboard);

  cy.wait(540000);
}
