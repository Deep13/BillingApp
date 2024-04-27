sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/m/Button", "sap/m/Input", "sap/m/Label", "sap/m/library", "sap/m/MessageBox",],
    function (Controller, JSONModel, History, Button, Input, Label, mobileLibrary, MessageBox) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;
        return Controller.extend("Billing.Billing.controller.VoucherList", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */

            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("VoucherList")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            doc_keyUp: function (e) {

                // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
                if (e.ctrlKey && e.code === 'KeyP') {
                    // call your function to do the thing
                    alert("Printing")
                }
            },
            _handleRouteMatched: async function (oEvent) {
                var data = this.getUserLog();
                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {

                    // register the handler 
                    document.addEventListener('keyup', this.doc_keyUp, false);
                    var oId = oEvent.getParameter('arguments').order_id;
                    if (oId) {
                        this.refreshData(oId);
                    }
                }

                var default_rate = await localStorage.getItem("gold_rate");
                this.getView().byId("gold_rate").setValue(default_rate);


            },
            calRate: async function () {
                var default_rate = this.getView().byId("gold_rate").getValue();
                if (default_rate) {
                    var grams = this.getView().byId("grams").getValue();
                    var data = this.getView().getModel().getData().results;
                    var total_grams = 0;
                    var total_cash = 0;
                    data.forEach(val => {
                        total_grams += parseFloat(val.amount / val.rate);
                        total_cash += parseFloat(val.amount);
                    })
                    total_grams = total_grams.toFixed(2)
                    var remainingGrams = parseFloat(grams) - parseFloat(total_grams);
                    var remainingAmount = remainingGrams * parseFloat(default_rate);
                    remainingAmount = remainingAmount.toFixed(2);
                    var final_rate = (total_cash + parseFloat(remainingAmount)) / parseFloat(grams);
                    this.getView().byId("rate").setText("Final Rate: " + final_rate);
                }
                else {
                    alert("Current gold rate not found")
                }


            },
            getgram: function (rate, amount) {
                console.log(rate, amount)
                return (amount / rate).toFixed(2)
            },
            refreshData: function (oId) {
                var that = this;
                var host = this.getHost();
                // this.schema = []
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getVouchersById",
                        data: JSON.stringify({
                            order_id: oId
                        })
                    },
                    success: function (dataClient) {
                        try {
                            if (dataClient) {
                                var aData = JSON.parse(dataClient);
                                that.getView().byId('tableHeader').setText(`Vouchers (${aData.length})`)
                                var jData = new sap.ui.model.json.JSONModel({ results: aData });
                                that.getView().setModel(jData);
                            }
                            else {
                                var jData = new sap.ui.model.json.JSONModel({ results: [] });
                                that.getView().setModel(jData);
                            }
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

            onpressBack: function (oEvent) {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();
                document.removeEventListener('keyup', this.doc_keyUp);
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.oRouter.navTo("OrderList", {
                        order_id: "null"
                    });
                }

            },
            onPressPrint: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().id;
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getVoucherWithOrder",
                        data: JSON.stringify({
                            voucher_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aDataDetail = JSON.parse(dataClient);
                            aDataDetail = aDataDetail[0];
                            that.generateInvoiceBill(aDataDetail);
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

                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = this.getHTMLContent(data);

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },


            getHTMLContent: function (data) {
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.amount))
                return `<!DOCTYPE html>
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
                
                <body id="main-body">
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
                                    ">ADVANCE - VOUCHER</div>
                                        </div>
                                        <div class="inv-header-right">
                                        </div>
                                    </div>
                                    <div class="invoice-address">
                                        <div class="invoice-to">
                                            <span>Invoice To:</span>
                                            <div class="inv-to-address">
                                               ${data.name}<br>
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
                                                    <td>Order No.</td>
                                                    <td style="text-align:left">: ${data.order_id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher No.</td>
                                                    <td style="text-align:left">: ${data.id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher Date</td>
                                                    <td style="text-align:left">: ${data.voucher_date}</td>
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
                                                        <th class="table_width_2">Item</th>
                                                        <th class="table_width_1">HSN</th>
                                                        <th class="table_width_1 text-center">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td class="">${data.type}</td>
                                                    <td class="table-description">${data.HSN}</td>
                                                    <td class="text-center">${data.amount}</td>
                                                   
                                                </tr>
                                                 </tbody>
                       </table>
                   </div>
               </div>
               <div class="invoice-table-footer" style="
               display: flex;
               align-items: flex-start;
           ">
                   <div class="table-footer-left">
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
                           <td>CARD</td>
                           <td>: ${data.card}${data.apprcode ? ` Approval Code: ${data.apprcode}` : ''}</td>
                       </tr>
                       <tr>
                           <td>UPI</td>
                           <td>: ${data.upi}${data.upidetails ? ` (${data.upidetails})` : ''}</td>
                       </tr>
                       <tr>
                           <td>BANK TRF</td>
                           <td>: ${data.bank}${data.bank_details ? ` (${data.bank_details})` : ''}</td>
                       </tr>
                       <tr>
                       <td>OLD GOLD ADJ</td>
                       <td>: ${data.oldgold}</td>
                   </tr>
                   </tbody>
               </table>
               <br/>
               <div>
               <span style="padding:10px 0px;font-weight:bold;color:black">${inWords}</span>
               </div>
                   </div>
                   <div class="table-footer-right">
                       <table class="totalamt-table">
                           <tbody>
                               <tr>
                                   <td>Total:</td>
                                   <td>${data.amount}</td>
                               </tr>
                           </tbody>
                       </table>
                   </div>
               </div>
            </div>
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
html2pdf(staticContent,{ filename: "Advance-voucher:"+${data.order_id} });
}
</script>
</html>`;
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
