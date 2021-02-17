//get the wrap token from passed in parameter
var wrap_token = process.argv[2];

if (!wrap_token) {
	console.error("No wrap token, enter token as argument");
	process.exit();
}

var options = {
	apiVersion: "v1", // default
	endpoint: "http://127.0.0.1:8200",
	token: wrap_token, //wrap token
};

console.log("Token being used " + process.argv[2]);

// get new instance of the client
var vault = require("node-vault")(options);

//role that you are using
const roleId = "f5df3249-d3d9-1e0b-af41-084b0b74ae2e";

//using the wrap token to unwrap and get the secret
vault
	.unwrap()
	.then((result) => {
		var secretId = result.data.secret_id;
		console.log("Your secret id is " + result.data.secret_id);

		//login with approleLogin
		vault.approleLogin({ role_id: roleId, secret_id: secretId }).then((login_result) => {
			var client_token = login_result.auth.client_token;
			console.log("Using client token to login " + client_token);
			var client_options = {
				apiVersion: "v1", // default
				endpoint: "http://127.0.0.1:8200",
				token: client_token, //client token
			};

			var client_vault = require("node-vault")(client_options);

			client_vault.read("secret/weatherapp/config").then((read_result) => {
				console.log(read_result);
			});
		});
	})
	.catch(console.error);
