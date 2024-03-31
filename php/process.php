<?php 
header("Access-Control-Allow-Origin:*");
// header('Content-Type: application/json');
echo $_POST["method"]();

function login()
{
    $json = file_get_contents('php://input');
    $data = json_decode($_POST["data"]);

    $response = []; // Initialize an empty response array

    if (isset($data->user_name) && isset($data->password)) {
        $user_name = $data->user_name;
        $password = $data->password;

        $servername = "localhost";
        $username = "root";
        $dbname = "Billing_management"; // Updated database name

        $conn = new mysqli($servername, $username, "", $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT id, email, user_name, role FROM users WHERE user_name = ? AND password = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("ss", $user_name, $password);
        
            if ($stmt->execute()) {
                $stmt->bind_result($id, $email, $user_name, $role);
        
                if ($stmt->fetch()) {
                    $response["id"] = $id;
                    $response["email"] = $email;
                    $response["user_name"] = $user_name;
                    $response["role"] = $role;
                    $response["prompt"] = "Authentication successful";
                } else {
                    $response["prompt"] = "Authentication failed";
                }
            } else {
                $response["prompt"] = "Error during authentication";
            }

            $stmt->close();
        } else {
            $response["prompt"] = "Error preparing query";
        }

        $conn->close();
    } else {
        $response["prompt"] = "Missing user_name or password in data";
    }

    echo json_encode($response);
}

function getOrnament(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}
	// Perform query
	if ($result = $conn -> query("SELECT ornament.*, COUNT(stocks.orm_desc) AS count,
	COALESCE(SUM(stocks.sold = 1), 0) AS sold
	FROM ornament
	LEFT JOIN stocks ON ornament.item = stocks.orm_desc
	GROUP BY ornament.item")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
}

function getOrnamentType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM ornamenttype")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}

function getPurity(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM purity")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}
function getPurchase(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM purchase")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}
function getPurchaseById(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
    $purchase_id = $obj->purchase_id;
	// Perform query
	if ($result = $conn -> query("SELECT * FROM purchase where id = $purchase_id")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}
function getPurchaseDetailsById(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
    $purchase_id = $obj->purchase_id;
	// Perform query
	if ($result = $conn -> query("SELECT * FROM purchase_details where purchase_id = $purchase_id")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}
function getIdentificationType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM identificationtype")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}

function getInvoices(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT invoices.*, COUNT(voucher.order_id) AS vouchers FROM invoices LEFT JOIN voucher ON invoices.invoice_id = voucher.order_id GROUP BY invoices.invoice_id ORDER BY invoices.created_at DESC")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}

function getGstEntry(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM gstentry")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}

function getSellerDetails(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM seller_details")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
	}
	echo json_encode($dataArray);
	}
	}
	$conn->close();
}

function getHsnCode(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM hsncode")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

function getStateCode(){
$servername = "localhost";
$username = "root";
$dbname = "Billing_management";
// Create connection
$conn = new mysqli($servername, $username,"", $dbname);
// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
// Perform query
if ($result = $conn -> query("SELECT * FROM statecode")) {
	if($result->num_rows > 0) {
	$i = 0;
	while($row = $result->fetch_assoc()){
	$dataArray[$i] = $row;
	$i = $i + 1;
}
	echo json_encode($dataArray);
}
	}
$conn->close();

}
function getHmCharge(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM hmcharge")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
$conn->close();

	}



function getStocks() {
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}
	// Perform query
	if ($result = $conn -> query("SELECT * FROM stocks")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
	$conn->close();

}

	
function getCustomers()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Perform query
    if ($result = $conn->query("SELECT * FROM customers")) {
        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $dataArray[$i] = $row;
                $i = $i + 1;
            }
            echo json_encode($dataArray);
        }
    }
	$conn->close();

}
function getOrders()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Perform query
    if ($result = $conn->query("SELECT orders.*, COUNT(voucher.order_id) AS vouchers,SUM(orders.old_gold_amount + COALESCE(voucher.amount, 0)) AS total_combined_amount
	FROM orders
	LEFT JOIN voucher ON orders.order_id = voucher.order_id
	GROUP BY orders.order_id")) {
        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $dataArray[$i] = $row;
                $i = $i + 1;
            }
            echo json_encode($dataArray);
        }
    }
	$conn->close();

}

function getVouchers()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Perform query
    if ($result = $conn->query("SELECT * from voucher")) {
        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $dataArray[$i] = $row;
                $i = $i + 1;
            }
            echo json_encode($dataArray);
        }
    }
	$conn->close();

}

function getVouchersById()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
	$obj = json_decode($_POST["data"]);
    $order_id = $obj->order_id;
    // Perform query
    if ($result = $conn->query("SELECT * from voucher where order_id=$order_id")) {
        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $dataArray[$i] = $row;
                $i = $i + 1;
            }
            echo json_encode($dataArray);
        }
    }
	$conn->close();

}

function getCustomerByContact()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve the contact number from the POST data
    $obj = json_decode($_POST["data"]);
    $contact_number = $obj->contact_number;

    // Prepare the SQL query with a parameter to avoid SQL injection
    $query = "SELECT * FROM `customers` WHERE `contact_number` = ?";

    if ($stmt = $conn->prepare($query)) {
        // Bind the contact number parameter to the query
        $stmt->bind_param("s", $contact_number);

        // Execute the query
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            // Check if a customer was found
            if ($result->num_rows > 0) {
                $customerData = $result->fetch_assoc();
                echo json_encode($customerData);
            } else {
                echo "[]";
            }
        } else {
            echo "Error executing query: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Error preparing query: " . $conn->error;
    }

    // Close the connection
    $conn->close();
}


function getOrderByNumberBuyer()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve the contact number from the POST data
    $obj = json_decode($_POST["data"]);
    $order_id = $obj->order_id;

    // Prepare the SQL query with a parameter to avoid SQL injection
    $query = "SELECT orders.*, SUM(orders.total_amount + COALESCE(voucher.amount, 0)) AS total_combined_amount
	FROM orders
	LEFT JOIN voucher ON orders.order_id = voucher.order_id
	WHERE orders.order_id = ?
	GROUP BY orders.order_id ";

    if ($stmt = $conn->prepare($query)) {
        // Bind the contact number parameter to the query
        $stmt->bind_param("s", $order_id);

        // Execute the query
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            // Check if a customer was found
            if ($result->num_rows > 0) {
                $orderData = $result->fetch_assoc();
                echo json_encode($orderData);
            } else {
                echo "[]";
            }
        } else {
            echo "Error executing query: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Error preparing query: " . $conn->error;
    }

    // Close the connection
    $conn->close();
}


function getOrderByNumber()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve the contact number from the POST data
    $obj = json_decode($_POST["data"]);
    $order_id = $obj->order_id;

    // Prepare the SQL query with a parameter to avoid SQL injection
    $query = "SELECT * FROM `orders` WHERE `order_id` = ?";

    if ($stmt = $conn->prepare($query)) {
        // Bind the contact number parameter to the query
        $stmt->bind_param("s", $order_id);

        // Execute the query
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            // Check if a customer was found
            if ($result->num_rows > 0) {
                $orderData = $result->fetch_assoc();
                echo json_encode($orderData);
            } else {
                echo "[]";
            }
        } else {
            echo "Error executing query: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Error preparing query: " . $conn->error;
    }

    // Close the connection
    $conn->close();
}

function getSalesman()
{
	$servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Perform query
    if ($result = $conn->query("SELECT * FROM users where type = 1")) {
        if ($result->num_rows > 0) {
            $i = 0;
            while ($row = $result->fetch_assoc()) {
                $dataArray[$i] = $row;
                $i = $i + 1;
            }
            echo json_encode($dataArray);
        }
    }
	$conn->close();
}
function getStockByORMCODE(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}

		 $obj = json_decode($_POST["data"]);
		$omcode = $obj->omcode;
		//  $id = $obj->id;
	// Perform query
	if ($result = $conn -> query("SELECT * FROM `stocks` WHERE `om_code` = '$omcode' AND `sold` = 0")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

function getLatestVoucher(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}

			$obj = json_decode($_POST["data"]);
		$omcode = $obj->omcode;
		//  $id = $obj->id;
	// Perform query
	if ($result = $conn -> query("SELECT max(id) FROM voucher ORDER BY id DESC LIMIT 0, 1")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

function getLatestMemo(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}

		//  $id = $obj->id;
	// Perform query
	if ($result = $conn -> query("SELECT max(id) FROM purchase ORDER BY id DESC LIMIT 0, 1")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

function getLatestInvoice(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}

		//  $id = $obj->id;
	// Perform query
	if ($result = $conn -> query("SELECT max(invoice_id) FROM invoices ORDER BY invoice_id DESC LIMIT 0, 1")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

function getFullInvoice(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
		if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		}
		$obj = json_decode($_POST["data"]);
		$invoice_id = $obj->invoice_id;
	if ($result = $conn -> query("SELECT invoices.*,gstAck.irn,gstAck.ack,gstAck.ackdate,gstAck.qrurl,gstAck.einvoice FROM invoices LEFT JOIN gstAck ON invoices.invoice_id = gstAck.invoice_id WHERE invoices.invoice_id = $invoice_id")) {
		if($result->num_rows > 0) {
		$i = 0;
		while($row = $result->fetch_assoc()){
		$dataArray[$i] = $row;
		$i = $i + 1;
	}
		echo json_encode($dataArray);
	}
		}
		$conn->close();
	}

	function getInvoiceDetail(){
		$servername = "localhost";
		$username = "root";
		$dbname = "Billing_management";
		// Create connection
		$conn = new mysqli($servername, $username,"", $dbname);
		// Check connection
			if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
			}
			$obj = json_decode($_POST["data"]);
			$invoice_id = $obj->invoice_id;
		if ($result = $conn -> query("SELECT * FROM invoice_details WHERE invoice_id = $invoice_id")) {
			if($result->num_rows > 0) {
			$i = 0;
			while($row = $result->fetch_assoc()){
			$dataArray[$i] = $row;
			$i = $i + 1;
		}
			echo json_encode($dataArray);
		}
			}
			$conn->close();
		}

		function getOrderWithVoucher(){
			$servername = "localhost";
			$username = "root";
			$dbname = "Billing_management";
			// Create connection
			$conn = new mysqli($servername, $username,"", $dbname);
			// Check connection
				if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
				}
				$obj = json_decode($_POST["data"]);
				$order_id = $obj->order_id;
			if ($result = $conn -> query("SELECT voucher.*,orders.contact_number,orders.name,orders.id_type,orders.id_value,orders.address,orders.state,orders.state_code,orders.gst_number,orders.pincode,orders.notes,orders.HSN,orders.cash,orders.cheque,orders.chequeno,orders.upidetails,orders.apprcode,orders.bankdetails,orders.upi,orders.card,orders.bank,orders.old_gold_amount,orders.adv_amount,orders.total_amount,orders.type,orders.purity,orders.created_by FROM orders JOIN voucher ON orders.order_id = voucher.order_id WHERE orders.order_id =  $order_id")) {
				if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()){
				$dataArray[$i] = $row;
				$i = $i + 1;
			}
				echo json_encode($dataArray);
			}
				}
				$conn->close();
			}

			function getVoucherWithOrder(){
				$servername = "localhost";
				$username = "root";
				$dbname = "Billing_management";
				// Create connection
				$conn = new mysqli($servername, $username,"", $dbname);
				// Check connection
					if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
					}
					$obj = json_decode($_POST["data"]);
					$voucher_id = $obj->voucher_id;
				if ($result = $conn -> query("SELECT voucher.*,orders.contact_number,orders.name,orders.id_type,orders.id_value,orders.address,orders.state,orders.state_code,orders.gst_number,orders.pincode,orders.notes,orders.HSN,orders.cash,orders.cheque,orders.chequeno,orders.upidetails,orders.apprcode,orders.bankdetails,orders.upi,orders.card,orders.bank,orders.old_gold_amount,orders.adv_amount,orders.total_amount,orders.type,orders.purity,orders.created_by FROM voucher JOIN orders ON voucher.order_id = orders.order_id WHERE voucher.id =  $voucher_id")) {
					if($result->num_rows > 0) {
					$i = 0;
					while($row = $result->fetch_assoc()){
					$dataArray[$i] = $row;
					$i = $i + 1;
				}
					echo json_encode($dataArray);
				}
					}
					$conn->close();
				}
// ----------------------------- Insert Ornament ---------------------------------------------

function insertCustomer()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $obj = json_decode($_POST["data"]);
    $contact_number = $obj->contact_number;
    $address = $obj->address;
    $name = $obj->name;
    $id_type = $obj->id_type;
    $id_value = $obj->id_value;
    $gst_number = $obj->gst_number;
    $state = $obj->state;
    $state_code = $obj->state_code;
    $pincode = $obj->pincode;
    // Perform query
    $sql = "INSERT INTO `customers` ( `contact_number`, `address`, `name`, `id_type`, `id_value`, `gst_number`, `state`,`state_code`, `pincode`) VALUES ( '$contact_number', '$address', '$name', '$id_type', '$id_value', '$gst_number', '$state','$state_code', '$pincode')";
    if (mysqli_query($conn, $sql)) {
        $dataArray[0] = 'Insertion successful';
        echo json_encode($dataArray);
    } else {
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
    }
	$conn->close();

}

function insertStock() {
	$servername = "localhost";
$username = "root";
$dbname = "Billing_management";
// Create connection
$conn = new mysqli($servername, $username,"", $dbname);
// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$om_type = $obj->om_type;
	$orm_desc = $obj->orm_desc;
	$om_code = $obj->om_code;
	$purity = $obj->purity;
	$gross_wt = $obj->gross_wt;
	$net_wt = $obj->net_wt;
	$stone_wt = $obj->stone_wt;
	$qty = $obj->qty;
	$huid = $obj->huid;
// Perform query
$sql = "INSERT INTO `stocks` (`om_type`,`orm_desc`, `om_code`, `purity`, `gross_wt`, `net_wt`, `stone_wt`, `qty`, `huid`) VALUES ( '$om_type','$orm_desc', '$om_code', '$purity', '$gross_wt', '$net_wt', '$stone_wt', '$qty', '$huid')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();

}


function insertStateCode(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
    // Perform query
    $sql = "INSERT INTO statecode(item) VALUES ('$item')";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Insertion successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
        }
	$conn->close();

    }

function insertIdentificationType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	// Perform query
	$sql = "INSERT INTO identificationtype(item) VALUES ('$item')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();

}

function insertOrnamentType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$suffix = $obj->suffix;
	// Perform query
	$sql = "INSERT INTO `ornamenttype` (`id`, `item`, `suffix`) VALUES (NULL, '$item', '$suffix')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function insertOrnament(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$otid = $obj->otid;
	$ottitle = $obj->ottitle;
	$suffix = $obj->suffix;
	// Perform query
	$sql = "INSERT INTO `ornament` (`id`, `item`, `suffix`,`otid`,`ottitle`) VALUES (NULL, '$item', '$suffix','$otid','$ottitle')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function insertPurity(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	// Perform query
	$sql = "INSERT INTO purity(item) VALUES ('$item')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function insertGstEntry(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$value = $obj->value;
	// Perform query
	$sql = "INSERT INTO `gstentry`(`item`,`value`) VALUES ('$item', '$value')";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Insertion successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Insertion failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function insertHsnCode(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
        $om_id = $obj->om_id;
        $om_type = $obj->om_type;
    // Perform query
    $sql = "INSERT INTO hsncode(`item`,`om_type`,`om_id`) VALUES ('$item', '$om_type','$om_id')";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Insertion successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
        }
		$conn->close();
    }
	function insertHmCharge(){
		$servername = "localhost";
		$username = "root";
		$dbname = "Billing_management";
		// Create connection
		$conn = new mysqli($servername, $username,"", $dbname);
		// Check connection
			if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
			}
			$obj = json_decode($_POST["data"]);
			$item = $obj->item;
			$om_id = $obj->om_id;
			$om_type = $obj->om_type;
		// Perform query
		$sql =  "INSERT INTO `hmcharge`(`item`,`om_type`,`om_id`) VALUES ('$item', '$om_type','$om_id')";
			if(mysqli_query($conn,$sql)){
			$dataArray[0] = 'Insertion successful';
			echo json_encode($dataArray);
			}
			else{
			$dataArray[0] = 'Insertion failed';
			echo json_encode($dataArray);
			}
		$conn->close();

		}

		function insertInvoice()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $obj = json_decode($_POST["data"]);
    
    $contact_number = $obj->contact_number;
    $customer_name = $obj->customer_name;
    $id_type = $obj->id_type;
    $card_number = $obj->card_number;
    $address = $obj->address;
    $state = $obj->state;
    $invoice_date = $obj->invoice_date;
    $gst_number = $obj->gst_number;
    $city_pin = $obj->city_pin;
    $notes = $obj->notes;
    $discounted_price = $obj->discounted_price;
    $cgst = $obj->cgst;
    $sgst = $obj->sgst;
    $nontax = $obj->nontax;
    $taxamount = $obj->taxamount;
    $taxafamount = $obj->taxafamount;
    $adv = $obj->adv;
    $total_amount = $obj->total_amount;
    $type = $obj->type;
    $purity = $obj->purity;
    $rate = $obj->rate;
	$created_by = $obj->created_by;
    $cash = $obj->cash;
    $cheque = $obj->cheque;
    $upi = $obj->upi;
    $card = $obj->card;
    $bank = $obj->bank;
	$chequeno = $obj->chequeno;
    $upidetails = $obj->upidetails;
    $apprcode = $obj->apprcode;
    $bankdetails = $obj->bankdetails;
    $due = $obj->due;

	$sql = "SELECT MAX(invoice_id) AS max_id FROM invoices";
$result = $conn->query($sql);

// If there are no records, set the initial value to 0
$max_id = ($result->num_rows > 0) ? $result->fetch_assoc()['max_id'] : 0;

// Increment the ID for the new record
$new_id = $max_id + 1;

    // Perform query
    $sql = "INSERT INTO `invoices` (`invoice_id`,`contact_number`, `customer_name`, `id_type`, `card_number`, `address`, `state`, `invoice_date`, `gst_number`, `city_pin`, `notes`,`rate`, `discounted_price`, `cgst`, `sgst`, `nontax`, `total_amount`, `type`, `purity`,`created_by`, `cash`,`cheque`, `upi`,`card`, `bank`,`chequeno`, `upidetails`,`apprcode`, `bankdetails`, `due`,`taxamount`, `taxafamount`, `adv`) 
            VALUES ($new_id,'$contact_number', '$customer_name', '$id_type', '$card_number', '$address', '$state', '$invoice_date', '$gst_number', '$city_pin', '$notes','$rate', '$discounted_price', '$cgst', '$sgst','$nontax', '$total_amount', '$type', '$purity','$created_by', '$cash','$cheque','$upi', '$card', '$bank','$chequeno','$upidetails', '$apprcode', '$bankdetails', '$due','$taxamount', '$taxafamount', '$adv')";

    if (mysqli_query($conn, $sql)) {
        // $invoiceId = mysqli_insert_id($conn); // Get the last inserted ID
        $dataArray[0] = 'Insertion successful';
        $dataArray[1] = $new_id; // Include the generated ID in the response
        echo json_encode($dataArray);
    } else {
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
    }
}


function insertInvoiceDetails()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $data = json_decode($_POST["data"]);

    $items = $data->data;
    $invoiceId = $data->invoice_id;

    foreach ($items as $item) {
        $ormDesc = $item->orm_desc;
        $omCode = $item->om_code;
        $grossWt = $item->gross_wt;
        $netWt = $item->net_wt;
        $stoneWt = $item->stone_wt;
        $st_value = $item->st_val;
        $qty = $item->qty;
        $amount = $item->amount;
        $making = $item->making;
        $value = $item->value;
        $hm_charge = $item->hmcharge;
        $huid = $item->huid;

        // Perform query
        $sql = "INSERT INTO `invoice_details` 
                (`invoice_id`,`om_code`, `orm_desc`,`gross_wt`, `net_wt`, `stone_wt`, `st_value`, `qty`, `amount`, `making`, `value`, `hm_charge`, `huid`) 
                VALUES ('$invoiceId','$omCode','$ormDesc', '$grossWt', '$netWt', '$stoneWt', '$st_value', '$qty', '$amount', '$making', '$value', '$hm_charge', '$huid' )";

        if (!mysqli_query($conn, $sql)) {
            $dataArray[0] = 'Insertion failed';
            echo json_encode($dataArray);
            return;
        }
    }

    $dataArray[0] = 'Insertion successful';
    echo json_encode($dataArray);
}

function insertPurchase()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $obj = json_decode($_POST["data"]);
    
    $contact_number = $obj->contact_number;
    $customer_name = $obj->customer_name;
    $id_type = $obj->id_type;
    $card_number = $obj->card_number;
    $address = $obj->address;
    $state = $obj->state;
    $purchase_date = $obj->purchase_date;
    $gst_number = $obj->gst_number;
    $city_pin = $obj->city_pin;
    $others = $obj->others;
   
    $cgst = $obj->cgst;
    $sgst = $obj->sgst;
    $taxamount = $obj->taxamount;
    $total_amount = $obj->total_amount;
    $type = $obj->type;
    $purity = $obj->purity;
    $rate = $obj->rate;
	$created_by = $obj->created_by;
    $cash = $obj->cash;
    $cheque = $obj->cheque;
    $adjo = $obj->adjo;
    $card = $obj->card;
    $adjp = $obj->adjp;
	$chequeno = $obj->chequeno;
    $adjonumber = $obj->adjonumber;
    $apprcode = $obj->apprcode;
    $adjpnumber = $obj->adjpnumber;


	$sql = "SELECT MAX(id) AS max_id FROM purchase";
$result = $conn->query($sql);

// If there are no records, set the initial value to 0
$max_id = ($result->num_rows > 0) ? $result->fetch_assoc()['max_id'] : 0;

// Increment the ID for the new record
$new_id = $max_id + 1;

    // Perform query
    $sql = "INSERT INTO `purchase` (`id`,`contact_number`, `customer_name`, `id_type`, `card_number`, `address`, `state`, `purchase_date`, `gst_number`, `city_pin`, `others`,`rate`, `cgst`, `sgst`, `taxamount`, `total_amount`, `type`, `purity`,`created_by`, `cash`,`cheque`, `adjo`,`card`, `adjp`,`chequeno`, `adjonumber`,`apprcode`, `adjpnumber`) 
            VALUES ('$new_id','$contact_number', '$customer_name', '$id_type', '$card_number', '$address', '$state', '$purchase_date', '$gst_number', '$city_pin', '$others','$rate', '$cgst', '$sgst','$taxamount', '$total_amount', '$type', '$purity','$created_by', '$cash','$cheque','$adjo', '$card', '$adjp','$chequeno','$adjonumber', '$apprcode', '$adjpnumber')";

    if (mysqli_query($conn, $sql)) {
        // $invoiceId = mysqli_insert_id($conn); // Get the last inserted ID
        $dataArray[0] = 'Insertion successful';
        $dataArray[1] = $new_id; // Include the generated ID in the response
        echo json_encode($dataArray);
    } else {
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
    }
}

function insertPurchaseDetails()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $data = json_decode($_POST["data"]);

    $items = $data->data;
    $purchase_id = $data->purchase_id;

    foreach ($items as $item) {
        $ormDesc = $item->orm_desc;
        $omCode = $item->om_code;
        $grossWt = $item->gross_wt;
        $netWt = $item->net_wt;
        $qty = $item->qty;
        $amount = $item->amount;

        // Perform query
        $sql = "INSERT INTO `purchase_details` 
                (`purchase_id`,`om_code`, `orm_desc`,`gross_wt`, `net_wt`, `qty`, `amount`) 
                VALUES ('$purchase_id','$omCode','$ormDesc', '$grossWt', '$netWt',  '$qty', '$amount' )";

        if (!mysqli_query($conn, $sql)) {
            $dataArray[0] = 'Insertion failed';
            echo json_encode($dataArray);
            return;
        }
    }

    $dataArray[0] = 'Insertion successful';
    echo json_encode($dataArray);
}

function insertOrder()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $obj = json_decode($_POST["data"]);
    
    $contact_number = $obj->contact_number;
    $customer_name = $obj->customer_name;
    $order_id = $obj->order_id;
    $id_type = $obj->id_type;
    $card_number = $obj->card_number;
    $address = $obj->address;
    $state = $obj->state;
    $state_code = $obj->state_code;
    $order_date = $obj->order_date;
    $gst_number = $obj->gst_number;
    $city_pin = $obj->city_pin;
    $notes = $obj->notes;
    $total_amount = $obj->total_amount;
    $adv_amount = $obj->adv_amount;
    $type = $obj->type;
    $purity = $obj->purity;
    $rate = $obj->rate;
	$created_by = $obj->created_by;
    $cash = $obj->cash;
    $cheque = $obj->cheque;
    $upi = $obj->upi;
    $card = $obj->card;
    $bank = $obj->bank;
	$chequeno = $obj->chequeno;
    $upidetails = $obj->upidetails;
    $apprcode = $obj->apprcode;
    $purchase_id = $obj->purchase_id;
    $old_gold_amount = $obj->old_gold_amount;
    $bankdetails = $obj->bankdetails;


	$sqlSelect = "SELECT item,om_type FROM hsncode WHERE om_id = $type";
	$result = $conn->query($sqlSelect);
	
	if ($result->num_rows > 0) {
		// Assuming the retrieved value is stored in $itemValue
		$row = $result->fetch_assoc();
		$itemValue = $row['item'];
		$omType = $row['om_type'];
	
		// Insert query to insert the value into another table (let's call it 'another_table')
		   // Perform query
		   $sql = "INSERT INTO `orders` (`order_id`,`contact_number`, `name`, `id_type`, `id_value`, `address`, `state`, `state_code`, `order_date`, `gst_number`, `pincode`, `notes`,`rate`,`total_amount`, `type`, `purity`,`created_by`, `cash`,`cheque`, `upi`,`card`, `bank`,`chequeno`, `upidetails`,`apprcode`, `purchase_id`,`old_gold_amount`,`bankdetails`,`adv_amount`,`HSN`) 
		   VALUES ('$order_id','$contact_number', '$customer_name', '$id_type', '$card_number', '$address', '$state','$state_code', '$order_date', '$gst_number', '$city_pin', '$notes','$rate', '$total_amount', '$omType', '$purity','$created_by', '$cash','$cheque','$upi', '$card', '$bank', '$chequeno','$upidetails', '$apprcode', '$purchase_id','$old_gold_amount','$bankdetails','$adv_amount','$itemValue')";

   if (mysqli_query($conn, $sql)) {
	   $invoiceId = mysqli_insert_id($conn); // Get the last inserted ID
	   $dataArray[0] = 'Insertion successful';
	   $dataArray[1] = $invoiceId; // Include the generated ID in the response
	   echo json_encode($dataArray);
   } else {
	   $dataArray[0] = 'Insertion failed';
	   echo json_encode($dataArray);
   }
	} else {
		$dataArray[0] = 'Insertion failed';
	   echo json_encode($dataArray);
	}


 
}

function insertVoucher()
{
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $obj = json_decode($_POST["data"]);
    
    $amount = $obj->amount;
    $order_id = $obj->order_id;
    $voucher_date = $obj->voucher_date;
    $rate = $obj->rate;

    // Perform query
    $sql = "INSERT INTO `voucher` (`order_id`,`amount`, `voucher_date`,`rate`) 
            VALUES ('$order_id','$amount', '$voucher_date','$rate')";

    if (mysqli_query($conn, $sql)) {
        $invoiceId = mysqli_insert_id($conn); // Get the last inserted ID
        $dataArray[0] = 'Insertion successful';
        $dataArray[1] = $invoiceId; // Include the generated ID in the response
        echo json_encode($dataArray);
    } else {
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
    }
}


function insertGstAckRecord() {
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    $conn = new mysqli($servername, $username, "", $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
	$obj = json_decode($_POST["data"]);
	$Irn = $obj->Irn;
	$AckNo = $obj->AckNo;
	$AckDt = $obj->AckDt;
	$QRCodeUrl = $obj->QRCodeUrl;
	$EinvoicePdf = $obj->EinvoicePdf;
	$Status = $obj->Status;
	$invoice_id = $obj->invoice_id;
    // Prepare and execute the SQL query
    $sql = "INSERT INTO `gstAck` (`invoice_id`, `ack`, `irn`, `ackdate`, `status`, `qrurl`, `einvoice`) VALUES ('$invoice_id', '$AckNo', '$Irn','$AckDt','$Status','$QRCodeUrl','$EinvoicePdf')";
    $result = $conn->query($sql);

    if ($result) {
        echo "";
    } else {
        echo "Error inserting record: " . $conn->error;
        http_response_code(500);
    }

    $conn->close();
}



// ----------------------------- Update Ornament ---------------------------------------------

	function updateStock() {
	$servername = "localhost";
	$username = "root";
	$password = ""; // Update this with your database password
	$dbname = "Billing_management";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	
	// Get data from POST request
	$obj = json_decode($_POST["data"]);
	$id = $obj->id;
	$orm_desc = $obj->orm_desc;
	$om_code = $obj->om_code;
	$purity = $obj->purity;
	$gross_wt = $obj->gross_wt;
	$net_wt = $obj->net_wt;
	$stone_wt = $obj->stone_wt;
	$qty = $obj->qty;
	$huid = $obj->huid;
	
	// Perform the update query
	$sql = "UPDATE `stocks` SET 
			`orm_desc` = '$orm_desc',
			`om_code` = '$om_code',
			`purity` = '$purity',
			`gross_wt` = '$gross_wt',
			`net_wt` = '$net_wt',
			`stone_wt` = '$stone_wt',
			`qty` = '$qty',
			`huid` = '$huid'
			WHERE `id` = $id";
	
	if (mysqli_query($conn, $sql)) {
		$dataArray[0] = 'Update successful';
		echo json_encode($dataArray);
	} else {
		$dataArray[0] = 'Update failed';
		echo json_encode($dataArray);
	}
	
	// Close the database connection
	$conn->close();
	}

	function updateRate(){
		$servername = "localhost";
		$username = "root";
		$dbname = "Billing_management";
		// Create connection
		$conn = new mysqli($servername, $username,"", $dbname);
		// Check connection
			if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
			}
			$obj = json_decode($_POST["data"]);
			$rate = $obj->rate;
		// Perform query
		$sql = "UPDATE `seller_details` SET `gold_rate` = '$rate' WHERE `seller_details`.`gstin` = '09AAAPG7885R002';";
			if(mysqli_query($conn,$sql)){
			$dataArray[0] = 'Update successful';
			echo json_encode($dataArray);
			}
			else{
			$dataArray[0] = 'Update failed';
			echo json_encode($dataArray);
			}
			$conn->close();
	
		}

function updateHmCharge(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
        $id = $obj->id;
        $om_id = $obj->om_id;
        $om_type = $obj->om_type;
    // Perform query
    $sql = "UPDATE `hmcharge` SET `item` = '$item',`om_id` = '$om_id',`om_type` = '$om_type' WHERE `hmcharge`.`id` = $id";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Update successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Update failed';
        echo json_encode($dataArray);
        }
		$conn->close();

    }

function updateHsnCode(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
        $id = $obj->id;
        $om_id = $obj->om_id;
        $om_type = $obj->om_type;
    // Perform query
    $sql = "UPDATE `hsncode` SET `item` = '$item',`om_id` = '$om_id',`om_type` = '$om_type' WHERE `hsncode`.`id` = $id";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Update successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Update failed';
        echo json_encode($dataArray);
        }
		$conn->close();
    }

function updateStateCode(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
        $id = $obj->id;
    // Perform query
    $sql = "UPDATE `statecode` SET `item` = '$item' WHERE `statecode`.`id` = $id";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Update successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Update failed';
        echo json_encode($dataArray);
        }
	$conn->close();

    }

function updateGstEntry(){
    $servername = "localhost";
    $username = "root";
    $dbname = "Billing_management";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $item = $obj->item;
        $id = $obj->id;
    // Perform query
    $sql = "UPDATE `gstentry` SET `value` = '$item' WHERE `gstentry`.`id` = $id";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Update successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Update failed';
        echo json_encode($dataArray);
        }
		$conn->close();
}

function updateOrnament(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$id = $obj->id;
	$suffix = $obj->suffix;
	$ottitle = $obj->ottitle;
	$otid = $obj->otid;
	// Perform query
	$sql = "UPDATE `ornament` SET `item` = '$item',`suffix` = '$suffix',`otid` = '$otid',`ottitle` = '$ottitle' WHERE `ornament`.`id` = $id";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Update failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function updateOrnamentType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$id = $obj->id;
	$suffix = $obj->suffix;
	// Perform query
	$sql = "UPDATE `ornamenttype` SET `item` = '$item' , `suffix` = '$suffix' WHERE `ornamenttype`.`id` = $id";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Update failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function updatePurity(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$id = $obj->id;
	// Perform query
	$sql = "UPDATE `purity` SET `item` = '$item' WHERE `purity`.`id` = $id";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Update failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function updateIdentificationType(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$item = $obj->item;
	$id = $obj->id;
	// Perform query
	$sql = "UPDATE `identificationtype` SET `item` = '$item' WHERE `identificationtype`.`id` = $id";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Update failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}
function updateCustomer()
{
    $servername = "localhost";
    $username = "root";
    $password = ""; // Update this with your database password
    $dbname = "Billing_management";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Get data from POST request
    $obj = json_decode($_POST["data"]);
    $id = $obj->id;
    $contact_number = $obj->contact_number;
    $address = $obj->address;
    $name = $obj->name;
    $id_type = $obj->id_type;
    $id_value = $obj->id_value;
    $gst_number = $obj->gst_number;
    $state = $obj->state;
    $state_code = $obj->state_code;
    $pincode = $obj->pincode;

    // Perform the update query
    $sql = "UPDATE `customers` SET 
            `contact_number` = '$contact_number',
            `address` = '$address',
            `name` = '$name',
            `id_type` = '$id_type',
            `id_value` = '$id_value',
            `gst_number` = '$gst_number',
            `state` = '$state',
            `state_code` = '$state_code',
            `pincode` = '$pincode'
            WHERE `id` = $id";

    if (mysqli_query($conn, $sql)) {
        $dataArray[0] = 'Update successful';
        echo json_encode($dataArray);
    } else {
        $dataArray[0] = 'Update failed';
        echo json_encode($dataArray);
    }

    // Close the database connection
    $conn->close();
}


function updateDue(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$balance = $obj->balance;
	$id = $obj->id;
	// Perform query
	$sql = "UPDATE `invoices` SET `due` = '$balance' WHERE `invoices`.`invoice_id` = $id";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
	$dataArray[0] = 'Update failed';
	echo json_encode($dataArray);
	}
	$conn->close();
}

function updateSold(){
	$servername = "localhost";
	$username = "root";
	$dbname = "Billing_management";
	// Create connection
	$conn = new mysqli($servername, $username,"", $dbname);
	// Check connection
	if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	}
	$obj = json_decode($_POST["data"]);
	$id = $obj->id;
	// Perform query
	$sql = "UPDATE `stocks` SET `sold` = 1 WHERE `stocks`.`om_code` = '$id'";
	if(mysqli_query($conn,$sql)){
	$dataArray[0] = 'Update successful';
	echo json_encode($dataArray);
	}
	else{
		echo "Error updating stocks: " . mysqli_error($conn);
	}
	$conn->close();
}
	// ----------------------------------------Generate Invoice ----------------------------------------------

	function generateInvoiceToken() {
		$servername = "localhost";
		$username = "root";
		$dbname = "Billing_management";
		// Create connection
		$conn = new mysqli($servername, $username, "", $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$curl = curl_init();
	
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://clientbasic.mastersindia.co/oauth/access_token',
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS =>'{
			"username": "testeway@mastersindia.co",
			"password": "Client!@#Demo987",
			"client_id": "TMDIIbTwzkCQWFTHpA",
			"client_secret": "BZpqtmFRIkfIrgjOfhyzQjLX",
			"grant_type": "password"
		}',
		  CURLOPT_HTTPHEADER => array(
			'Content-Type: application/json'
		  ),
		));
		
		$response = curl_exec($curl);
		$err = curl_error($curl);
		
		curl_close($curl);
		
		if ($err) {
			// Handle error
			echo 'error: ' . $err;
			http_response_code(500);
		} else {
			// Handle success
			echo $response;
			http_response_code(200);
		}
		$conn->close();
	}

	function generateInvoice() {
		$servername = "localhost";
		$username = "root";
		$dbname = "Billing_management";
		// Create connection
		$conn = new mysqli($servername, $username, "", $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$obj = json_decode($_POST["data"]);
		$token = $obj->token;
		$invoice_id = $obj->invoice_id;
		$curl = curl_init();
	
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://clientbasic.mastersindia.co/generateEinvoice',
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS =>'{
			"access_token": "' . $token . '",
			"user_gstin": "09AAAPG7885R002",
			"data_source": "erp",
			"transaction_details": {
				"supply_type": "B2B"
			},
			"document_details": {
				"document_type": "INV",
				"document_number": "' . $invoice_id . '/124",
				"document_date": "12/08/2022"
			},
			"seller_details": {
				"gstin": "09AAAPG7885R002",
				"legal_name": "MastersIndia UP",
				"address1": "Vila",
				"location": "Noida",
				"pincode": 201301,
				"state_code": "UTTAR PRADESH"
			},
			"buyer_details": {
				"gstin": "05AAAPG7885R002",
				"legal_name": "MastersIndia UT",
				"address1": "Kila",
				"location": "Nainital",
				"pincode": 263001,
				"place_of_supply": "5",
				"state_code": "UTTARAKHAND"
			},
			"dispatch_details": {
				"company_name": "MastersIndia UP",
				"address1": "Vila",
				"location": "Noida",
				"pincode": 201301,
				"state_code": "UTTAR PRADESH"
			},
			"ship_details": {
						"gstin": "05AAAPG7885R002",
						"legal_name": "MastersIndia UT",
						"address1": "Kila",
						"location": "Nainital",
						"pincode": 263001,
						"state_code": "UTTARAKHAND"
					},
			"value_details": {
				"total_assessable_value": "4",
				"total_cgst_value": "0",
				"total_sgst_value": "0",
				"total_invoice_value": "4.2"
			},
			"item_list": [
				{
					"item_serial_number": "501",
            "product_description": "Wheat desc",
            "is_service": "N",
            "hsn_code": "1001",
            "bar_code": "1212",
            "quantity": 1,
            "free_quantity": 0,
            "unit": "KGS",
            "unit_price": 4,
            "total_amount": 4,
            "pre_tax_value": 0,
            "discount": 0,
            "other_charge": 0,
            "assessable_value": 4,
            "gst_rate": 5,
            "igst_amount": 0.2,
            "cgst_amount": 0,
            "sgst_amount": 0,
            "cess_rate": 0,
            "cess_amount": 0,
            "cess_nonadvol_amount": 0,
            "state_cess_rate": 0,
            "state_cess_amount": 0,
            "state_cess_nonadvol_amount": 0,
            "total_item_value": 4.2,
            "country_origin": "",
            "order_line_reference": "",
            "product_serial_number": "",
					"batch_details": {
						"name": "aaa"
					}
				}
			]
		}',
		  CURLOPT_HTTPHEADER => array(
			'Content-Type: application/json'
		  ),
		));
		
		$response = curl_exec($curl);
		$err = curl_error($curl);
		
		curl_close($curl);
		
		if ($err) {
			// Handle error
			echo 'error: ' . $err;
			http_response_code(500);
		} else {
			// Handle success
			echo $response;
			http_response_code(200);
		}
		$conn->close();
	}
	
	
?>