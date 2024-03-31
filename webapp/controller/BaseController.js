sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("Billing.Billing.controller.BaseController", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       * @memberOf RecieptApp.RecieptApp.view.ClientPayment
       */
      onInit: function () {

      },
      getHost: function () {
        return "http://localhost:8080/BillingApp/php/process.php";
      },
      setUserLog: function (thisData) {
        localStorage.setItem("logid", JSON.stringify(thisData));
      },
      getUserLog: function () {
        return JSON.parse(localStorage.getItem("logid"));
      },
      fetchSellerDetails: function () {
        var that = this;
        var host = this.getHost();
        // this.schema = []
        $.ajax({
          url: host,
          type: "POST",
          data: {
            method: "getSellerDetails",
          },
          success: function (dataClient) {
            try {
              var aData = JSON.parse(dataClient);
              var jData = new sap.ui.model.json.JSONModel(aData);
              that.getOwnerComponent().setModel(jData, "SellerModel");
              // that.goldRate = aData.gold_rate;
            }
            catch (e) {
              alert("Something went wrong", e)
            }
          },
          error: function (request, error) {
            console.log('Error')
          }
        });
      },
    });
  }
);
