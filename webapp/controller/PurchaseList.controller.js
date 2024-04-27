sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library"],
    function (Controller, JSONModel, Dialog, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.PurchaseList", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("PurchaseList")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            _handleRouteMatched: function (oEvent) {
                var data = this.getUserLog();
                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    this.refreshData();
                    this.pId = oEvent.getParameter('arguments').purchase_id;
                    if (this.pId == "null") {
                        this.getView().byId("productInput").setValue("");
                    }
                }

            },
            refreshData: function () {
                var that = this;
                var host = this.getHost();
                // this.schema = []
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getPurchase",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Purchases (${aData.length})`)
                            var jData = new sap.ui.model.json.JSONModel({ results: aData });
                            that.getView().setModel(jData);
                        }
                        catch (e) {
                            console.log("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                });
            },
            onAdd: function () {
                this.oRouter.navTo("PurchaseWizard");

            },
            openPersoDialog: function (oEvt) {

            },
            dueStatusText: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Due';
                }
                return 'Completed'
            },
            dueStatus: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Error';
                }
                return 'Success'
            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },
            onPressPrint: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().id;
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getPurchaseById",
                        data: JSON.stringify({
                            purchase_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            aData = aData[0];
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getPurchaseDetailsById",
                                    data: JSON.stringify({
                                        purchase_id: id
                                    })
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataDetail = JSON.parse(dataClient);
                                        aData.productDetails = aDataDetail;
                                        that.generateInvoiceBill(aData);
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
                        catch (e) {
                            alert("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                });
            },
            generateInvoiceBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.total_amount))
                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                    <title>Manikanchan Jewellery House</title>
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
                
                    <!-- Fearther CSS -->
                    <link rel="stylesheet" href="./assets/css/feather.css">
                
                    <!-- Fontawesome CSS -->
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/fontawesome.min.css">
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/all.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                    <!-- Main CSS -->
                    <link rel="stylesheet" href="./assets/css/style.css">
                </head>
                
                <body>
                    <div class="main-wrapper">
                        <div class="container">
                            <div class="invoice-wrapper download_section" id="download_section">
                                <div class="inv-content">
                                    <div class="invoice-header">
                                        <div class="inv-header-left">
                                        <div style="
                                        font-size: 24px;
                                        font-weight: 700;
                                        color: #2c3038;
                                    ">PURCHASE MEMO</div>
                                        </div>
                                        <div class="inv-header-right">
                                            <div class="inv-details">
                                                <div class="inv-date">
                                                    Date: <span>${data.purchase_date}</span>
                                                </div>
                                                <div class="inv-date">
                                                   Memo No: <span>${data.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="invoice-address">
                                        <div class="invoice-to">
                                            <span>Invoice To:</span>
                                            <div class="inv-to-address">
                                               ${data.customer_name}<br>
                                               ${data.address}<br>
                                               ${data.gst_number}<br>
                                               ${data.contact_number}
                                            </div>
                                        </div>
                                        <div class="invoice-to">
                
                                        </div>
                                        <div class="company-details">
                                            <span></span>
                                            <div>
                                                <br />
                                                <table>
                                                    <tr>
                                                        <td>ORN.TYPE</td>
                                                        <td style="text-align:left">: ${data.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>PURITY</td>
                                                        <td style="text-align:left">: ${data.purity}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>RATE PER GRAM</td>
                                                        <td style="text-align:left">: ${data.rate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>SM CODE</td>
                                                        <td style="text-align:left">: ${data.created_by}</td>
                                                    </tr>
                                                </table>
                                            </div>
                
                                        </div>
                                    </div>
                                    <div class="invoice-table">
                                        <div class="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="table_width_1">SL. NO</th>
                                                        <th class="table_width_2">Item</th>
                                                        <th class="table_width_1 text-center">PCS</th>
                                                        <th class="table_width_1 text-center">GROSS W.T.(Gms)</th>
                                                        <th class="table_width_1 text-center">NET W.T.(Gms)</th>
                                                        <th class="table_width_1 text-center">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;

                data.productDetails.map((value, index) => {
                    printContent += `<tr>
                        <td>${index + 1}</td>
                        <td class="">${value.orm_desc}</td>
                        <td class="text-center">${value.qty}</td>
                        <td class="text-center">${value.gross_wt}</td>
                        <td class="text-center">${value.net_wt}</td>
                        <td class="text-center">${value.amount}</td>
                    </tr>`;
                });

                printContent += ` </tbody>
                       </table>
                   </div>
               </div>
               <div class="invoice-table-footer" style="align-items: baseline;">
                   <div class="table-footer-left" >
                       <span>MODE OF PAYMENT</span>
                       <br/>
                       <table>
                       <tbody>
                           <tr>
                               <td>CASH</td>
                               <td>: ${data.cash}</td>
                           </tr>
                           <tr>
                               <td>CHEQUE</td>
                               <td>: ${data.cheque}${data.chequeno ? ` (${data.chequeno})` : ''}</td>
                           </tr>
                           <tr>
                               <td>TAX INVOICE ADJ.</td>
                               <td>: ${data.adjp}${data.adjpnumber ? ` (TAX INVOICE NO:- ${data.adjpnumber})` : ''}</td>
                           </tr>
                           <tr>
                               <td>ORDER ADJ. </td>
                               <td>: ${data.adjo}${data.adjonumber ? ` (ORDER NO:- ${data.adjonumber})` : ''}</td>
                           </tr>
                           
                       </tbody>
                   </table>
                   <br/>
                   <div>
                   <span style="padding:10px 0px;font-weight:bold;color:black">${inWords}</span>
                   </div>
                   </div>
                  
                   <div class="text-end table-footer-right">
                   <table class="totalamt-table">
                   <tbody>
                       <tr>
                           <td>Total</td>
                           <td>${data.total_amount}</td>
                       </tr>
                   </tbody>
               </table>
                   </div>
               </div>
               `;
                printContent += `  </div>
       </div>
       <div class="file-link">
       <button class="download_btn download-link" onclick="downloadPDF()">
           <i class="feather-download-cloud me-1"></i> <span>Download</span>
       </button>
       <a href="#" id="printLink" class="print-link">
           <i class="feather-printer"></i> <span class="">Print</span>
       </a>
   </div>
   </div>
</div>
</body>
<script>
var printLink = document.getElementById('printLink');

// Add a click event listener to the link
printLink.addEventListener('click', function(event) {
// Prevent the default link behavior
event.preventDefault();

// Trigger the print action
window.print();
});

function downloadPDF() {
// Get the element containing the static content
var staticContent = document.getElementById('download_section');

// Use html2pdf to generate and download the PDF
html2pdf(staticContent,{ filename: "Purchase Memo:"+${data.id} });
}
</script>

</html>`;

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },
            filterTable: function () {
                var value = this.getView().byId("productInput").getValue();
                var oTable = this.byId("idTable"),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                var oFilter = new sap.ui.model.Filter("id", "Contains", value,);
                aFilters.push(oFilter);

                // apply filter settings
                oBinding.filter(aFilters);
            },
            onChange: function () {

                if (this.pId !== "null") {

                    this.getView().byId("productInput").setValue(this.pId);
                    this.pId = "null";
                    this.getView().byId("productInput").fireSubmit();

                }
            },
            convertToIndianWords: function (number) {
                var that = this;
                const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
                const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
                const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

                function convertThousands(num) {
                    const quotient = Math.floor(num / 1000);
                    const remainder = num % 1000;

                    let result = "";
                    if (quotient > 0) {
                        result += that.convertToIndianWords(quotient) + " thousand ";
                    }

                    if (remainder > 0) {
                        result += convertHundreds(remainder);
                    }

                    return result.trim();
                }

                function convertHundreds(num) {
                    if (num >= 100) {
                        const remainder = num % 100;
                        if (remainder !== 0) {
                            return words[Math.floor(num / 100)] + " hundred " + convertTens(remainder);
                        } else {
                            return words[Math.floor(num / 100)] + " hundred";
                        }
                    } else {
                        return convertTens(num);
                    }
                }

                function convertTens(num) {
                    if (num < 10) {
                        return words[num];
                    } else if (num >= 11 && num <= 19) {
                        return teens[num - 10];
                    } else {
                        return tens[Math.floor(num / 10)] + " " + words[num % 10];
                    }
                }

                if (number === 0) {
                    return "zero";
                } else if (number < 1000) {
                    return convertHundreds(number);
                } else {
                    return convertThousands(number);
                }
            },

            convertNumberToWordsIndianSystem: function (number) {
                const lakh = 100000;

                if (number < 0 || isNaN(number) || !Number.isInteger(number)) {
                    return "Invalid input";
                }

                if (number === 0) {
                    return "zero";
                }

                let result = "";

                // Convert lakh part
                const lakhPart = Math.floor(number / lakh);
                if (lakhPart > 0) {
                    result += this.convertToIndianWords(lakhPart) + " lakh ";
                }

                // Convert remaining part
                const remainingPart = number % lakh;
                if (remainingPart > 0) {
                    result += this.convertToIndianWords(remainingPart);
                }
                result = result.trim();
                var aResult = result.split(" ");
                var aUpper = [];
                aResult.map(val => {
                    aUpper.push(val[0].toUpperCase() + val.substr(1));
                });
                aUpper.push("Rupees Only")

                return aUpper.join(" ");
            },

        });
    }
);
