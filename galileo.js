
var access_token;
var refresh_token;
var cardHolder_id;
var account_id;

var accounts;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

function loginToGalileo(){
    console.log("Loging into Galileo")
    const data = null;

    xhr = new XMLHttpRequest();

    const GalileoAPIUsername = "CgZ1b6oVWOGP";
    const GalileoAPIPassword = "2nN3YeCt52DGe9wf0Xa2";

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            // console.log(response);
            access_token = response.access_token;
            // console.log(access_token);
            refresh_token = response.refresh_token;
            // console.log(refresh_token);

            refreshAccess(refresh_token);
            return refresh_token;
        }
      }
    );

    xhr.open("POST", "https://sandbox.galileo-ft.com/instant/v1/login?username=" + GalileoAPIUsername + "&password=" + GalileoAPIPassword);
    xhr.setRequestHeader("content-type", "application/json");

    xhr.send(data);
    console.log("finished logging in")
}

function refreshAccess(refreshToken){
    const data = null;

    xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            access_token = response.access_token;

            accounts = listAccounts(access_token, 5063);
            return access_token;
      }
    });
    xhr.open("POST", "https://sandbox.galileo-ft.com/instant/v1/refresh");

    xhr.setRequestHeader("Authorization", "Bearer " + refreshToken);


    xhr.send(data);
}

function getAgreements(productID) {
    const data = null;

    xhr = new XMLHttpRequest();

    refreshAccess()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        // console.log(this.responseText);
        var agreements;
        var response = JSON.parse(this.responseText)
        console.log("hit here")
        for (i in response.agreements){
            console.log(i)
            agreements = response.agreements[i];
        }
        xhr = null;
        return agreements;
      }
    });

    xhr.open("GET", "https://sandbox.galileo-ft.com/instant/v1/businesses/business_id/products/product_id/agreements");
    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);

    xhr.send(data);
}

function createCardholder(first_name, last_name, email, password, DOB, id_string, id_type,incomeAmount, incomeFrequency, incomeOccupation, incomeSource, mobileNumber, shippingAddress1, shippingAddress2='', shippingCity, shippingState, shippingZipcode, billingAddress1, billingAddress2='', billingCity, billingState, billingZipcode, productID)
{
    var agreements = getAgreements(productID);

    const data = JSON.stringify({
        "cardholder": {
          "address": {
            "city": billingCity,
            "state": billingState,
            "street": billingAddress1,
            "unit": billingAddress2,
            "zip_code": billingZipcode
          },
          "agreements": agreements,
          "identification": {
            "date_of_birth": DOB,
            "id": id_string,
            "id_type": id_type
          },
          "income": {
            "amount": incomeAmount,
            "frequency": incomeFrequency,
            "occupation": incomeOccupation,
            "source": incomeSource
          },
          "shipping_address": {
            "street": shippingAddress1,
            "state": shippingState,
            "city": shippingCity,
            "unit": shippingAddress2,
            "zip_code": shippingZipcode
          },
          "email": email,
          "first_name": first_name,
          "last_name": last_name,
          "mobile": mobileNumber
        },
        "product_id": productID
      });
      
      const xhr = new XMLHttpRequest();
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            return response.cardholder_id;
        }
      });
      
      xhr.open("POST", "https://sandbox.galileo-ft.com/instant/v1/cardholders");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + access_token);
      xhr.send(data);
}

function fundAccount(destinationAccountID, sourceAccountID, amount){
    const data = JSON.stringify({
        "amount": amount,
        "destination_account_id": destinationAccountID,
        "source_account_id": sourceAccountID
      });
      
      xhr = new XMLHttpRequest();
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          xhr = null;
          return accounts;
        }
      });
      
      xhr.open("POST", "https://sandbox.galileo-ft.com/instant/v1/transfers");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + access_token);
      
      xhr.send(data);
}

function listAccounts(accessToken, cardholderID){
    const data = null;

  const xhr = new XMLHttpRequest();

  var accounts;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      var response = JSON.parse(this.responseText);
      
      
      for (i in response.accounts){
        console.log(i)
        accounts[i] = response.accounts[i];
      }
      console.log(accounts);
      executeTransaction(5063, accounts[0], "american_red_cross", 2);
      return accounts;
    }
  });
  
  xhr.open("GET", "https://sandbox.galileo-ft.com/instant/v1/cardholders/cardholder_id/accounts");
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  
  refreshAccess(refresh_token);
  xhr.send(data);
}

function executeTransaction(cardholderID, accountID, merchantName, amount){
    const data = JSON.stringify({
        "amount": amount,
        "merchant_name": merchantName
      });
      
      xhr = new XMLHttpRequest();
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      jkjk
      xhr.open("POST", "https://sandbox.galileo-ft.com/instant/v1/cardholders/" + cardholderID + "/accounts/" + accountID + "/transactions");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + access_token);
      
      xhr.send(data);
}

function setupUser(){
  var dashboardAccountID = 10467;
  loginToGalileo();
  cardHolder_id = createCardholder("firstname", "lastname", "test@gmail.com","Password123$%^", "2000-01-01", "111223333", "ssn", "u150k" , "weekly", "science_engineering", "employment", "1204378956", "1234E 100S", "Apt. 1", "Salt Lake City", "UT", "84102", "1234E 100S", "Apt. 1", "Salt Lake City", "UT", "84102", 19467);
  var accounts = listAccounts(cardHolder_id);
  fundAccount(accounts[0], dashboardAccountID, 20);
}