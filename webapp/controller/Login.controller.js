sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel"],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("Billing.Billing.controller.Login", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf Billing.Billing.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            _handleRouteMatched: function () {
                var data = this.getUserLog();
                if (data) {
                    // alert('user logged in');
                    this.oRouter.navTo("Main");
                }
            },
            onLogin: function () {
                var that = this;
                var host = this.getHost();
                var email = this.getView().byId('userInput').getValue();
                var password = this.getView().byId('passwordInput').getValue();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "login",
                        data: JSON.stringify({ password: password, user_name: email })
                    },
                    success: function (dataClient) {
                        try {
                            // console.log(dataClient);
                            console.log(JSON.parse(dataClient))
                            let thisData = JSON.parse(dataClient)
                            if (thisData.prompt === 'Authentication successful') {
                                that.oRouter.navTo("Main");
                                that.setUserLog(thisData);
                                // setSalesmanCode(thisData.id)
                            } else if (thisData.prompt === 'Authentication failed') {
                                alert('Invalid credentials')
                            }
                            else {
                                alert(thisData.prompt)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                        alert('Some error occured')
                    }
                });
            }

        });
    }
);
