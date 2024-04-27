sap.ui.define(
  ["../controller/BaseController", "sap/m/MessageStrip"],
  function (Controller, MessageStrip) {
    "use strict";

    return Controller.extend("Billing.Billing.controller.Main", {
      onInit: function () {
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter
          .getRoute("Main")
          .attachPatternMatched(this._handleRouteMatched, this);
      },
      _handleRouteMatched: function (oEvent) {
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
              var jData = new sap.ui.model.json.JSONModel(aData[0]);
              that.getOwnerComponent().setModel(jData, "SellerModel");
              that.getView().setModel(jData);
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

        $.ajax({
          url: host,
          type: "POST",
          data: {
            method: "getIdHalueHelp",
          },
          success: function (dataClient) {
            try {
              var aData = JSON.parse(dataClient);
              var jData = new sap.ui.model.json.JSONModel({ results: aData });
              that.getView().setModel(jData, "SearchValueHelp");
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
      onSave: function () {
        var that = this;
        var host = this.getHost();
        var rate = this.getView().byId("goldRate").getValue();
        if (rate) {
          $.ajax({
            url: host,
            type: "POST",
            data: {
              method: "updateRate",
              data: JSON.stringify({
                rate: rate
              })
            },
            success: function (dataClient) {
              try {
                that.getView().getModel().setProperty("/gold_rate", rate);
                that.getOwnerComponent().getModel("SellerModel").setProperty("/gold_rate", rate);
                localStorage.setItem("gold_rate", rate);
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
        }
      },
      onPressOrnament: function (oEvent) {
        this.oRouter.navTo("Ornament");
      },
      onPressOrnamentType: function (oEvent) {
        this.oRouter.navTo("OrnamentType");
      },
      onPressPurity: function (oEvent) {
        this.oRouter.navTo("Purity");
      },
      onPressIdentification: function (oEvent) {
        this.oRouter.navTo("Identification");
      },
      onPressGST: function (oEvent) {
        this.oRouter.navTo("GST");
      },
      onPressState: function (oEvent) {
        this.oRouter.navTo("State");
      },
      onPressHSN: function (oEvent) {
        this.oRouter.navTo("HSN");
      },
      onPressHM: function (oEvent) {
        this.oRouter.navTo("HM");
      },
      onPressStock: function (oEvent) {
        this.oRouter.navTo("Stock");
      },
      onPressCustomer: function (oEvent) {
        this.oRouter.navTo("Customer");
      },
      onPressBuyer: function (oEvent) {
        this.oRouter.navTo("InvoiceList", {
          invoice_id: "null"
        });
      },
      onPressOrder: function () {
        this.oRouter.navTo("OrderList", {
          order_id: "null"
        });
      },
      onPressPurchase: function () {
        this.oRouter.navTo("PurchaseList", {
          purchase_id: "null"
        });
      },
      gotToPage: function (oEvent) {
        console.log(oEvent);
        var selected = oEvent.getParameter("selectedRow").getBindingContext("SearchValueHelp").getObject();
        if (selected.type == "Orders") {
          this.oRouter.navTo("OrderList", {
            order_id: selected.id
          });
        }
        else if (selected.type == "Invoices") {
          this.oRouter.navTo("InvoiceList", {
            invoice_id: selected.id
          });
        }
        else if (selected.type == "Purchase") {
          this.oRouter.navTo("PurchaseList", {
            purchase_id: selected.id
          });
        }
      }



    });
  }
);
