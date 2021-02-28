
/***************************************************

	USE THIS FUNCTION TO SHOW ERROR OR SUCCESS
	
***************************************************/

// show_popup('Your Message ...', 'error') // 'error', 'success', 'warning'














/***************************************************

	THESE ARE THE FUNCTIONS THAT REQUIRES DATA
	             FROM THE SERVER
	
***************************************************/





var refresh_rate_ = 1000 //ms

setInterval(function(){	
		// AJAX HEREE
	let url = document.URL;
	if (url.includes("dashboard")){
		$.ajax({
			url:"/api",
			method:"POST",
			data: {"action": "getalldata"},
			dataType:"JSON",
			success:function(data){
				IntervalDataUpdate({
					wan_ip: data.wan_ip_value, // STRING TYPE
					vpn_ip: data.vpn_ip_value, // STRING TYPE
					upload_rate: data.upload_rate_value, // STRING TYPE
					download_rate: data.download_rate_value, // STRING TYPE
					vpn_status: data.vpn_status_value, // STRING TYPE
					inject_status: data.inject_status // STRING TYPE
					// reconnect_status: data.inject_status // STRING TYPE
				});
			}
		});
	}

	


}, refresh_rate_);



setInterval(function(){
	// AJAX HEREE
	let url = document.URL;
	if (url.includes("dashboard")){
		$('#ovpn_textarea').load(location.origin + "/api/openvpnlogs");
		$('#http_textarea').load(location.origin + "/api/httplogs");

		// $('#ssh_textarea').load(location.origin + "/api/sshlogs"); <-- SSH LOGS AJAX
		// $('#recon_textarea').load(location.origin + "/api/reconlogs"); <-- AUTO RECONNECT LOGS AJAX
	}
	

}, refresh_rate_);




 
















/***************************************************

	THESE ARE THE FUNCTIONS GET AND POST TO THE SERVER
	
***************************************************/


function save_inject_vpn_with_http(inject_or_not) {
	// AJAX POST
	// This is the checkbox in the main settings where vpn should be injected or not
	// POST DATA: inject_or_not 
	// Data information:  - Boolean
	//                    - wo possible values (true or false)
	$.ajax({
		url:"/api",
		method:"POST",
		data: {action: "setinjector", isinject: (inject_or_not) ? "1" : "0"},
		dataType:"JSON",
		success:function(data){
			show_popup(data.msg, "success")
		}
	});

}

function save_recon_input(recon_or_not) {
	// AJAX POST
	// Checkbox if auto reconnect or not
	// POST DATA: recon_or_not 
	// Data information:  - Boolean
	//    

}

function change_wan_ip() {
	// GET REQUEST AJAX
	// Request backend to change WAN IP via AJAX
	if(confirm("Do you want to change WAN IP?")){
		$.ajax({
			url:"/api",
			method:"POST",
			data: {action: "changewanip"},
			dataType:"JSON",
			success:function(data){
				if(data.error == "" || data.error == null){
					get_wan_ip();
					show_popup(data.msg, "success")
				}else{
					show_popup(data.error, "error")
				}
			}
		});
	}
}

function reboot_device() {
	// GET REQUEST AJAX
	// Request backend to reboot device
	if(confirm("Do you want to reboot this device?")){
		$.ajax({
			url:"/api",
			method:"POST",
			data: {action: "rebootdevice"},
			dataType:"JSON",
			success:function(data){
				if(data.error == "" || data.error == null){
					show_popup(data.msg, "success")
				}else{
					show_popup(data.error, "error")
				}
			}
		});
	}
}

function turnoff_device() {
	// GET REQUEST AJAX
	// Request backend to turn off device
	if(confirm('Do you want turn off this device?')){
		$.ajax({
			url:"/api",
			method:"POST",
			data: {action: "turnoffdevice"},
			dataType:"JSON",
			success:function(data){
				if(data.error == "" || data.error == null){
					show_popup(data.msg, "success")
				}else{
					show_popup(data.error, "error")
				}
			}
		});
	}
}

function save_new_admin_login(admin_username, admin_password)
{
	// POST AJAX
	// Change ADMIN Username and Password
	// Data :
	//    admin_username == string
	//    admin_password == string (unencrypted)
	if (admin_username == "" || admin_username == undefined){
		show_popup("Please enter username.", "error")
	}else if(admin_password == "" || admin_password == undefined){
		show_popup("Please enter password.", "error")
	}else{
		$.ajax({
			url : "/api",
			method:"POST",
			data: {action: "savenewadminlogin", 
					uname: admin_username, 
					pword: admin_password
			},
			dataType:"JSON",
			success:function(data){
				if(data.error == null || data.error == ""){
					show_popup(data.msg, 'success');
					$('#admin_username').val('')
					$('#admin_password').val('')
				}else{
					show_popup(data.error, 'error');
				}
			}
		});
	}

}

function delete_config(config_name)
{
	// POST AJAX
	// Delete OpenVPN Config File
	// Data :
	//    config_name == string

	if(config_name != null || config_name != undefined){
		if(confirm("Do you want to delete " + config_name + "?")){
			$.ajax({
				url:"/api",
				method:"POST",
				data: {action: "deleteconfig", fileName:config_name},
				dataType:"JSON",
				success:function(data){
					if(data.error == "" || data.error == null){
						show_popup(data.msg, "success")
					}else{
						show_popup(data.error, "error")
					}
					get_openvpn_config_list();
				}
			});
		}
	}
}



function processFile(input)
{
	// POST AJAX
	// Upload .ovpn config file
	// Requires Special Ajax Configuration (@google) to successfuly upload file. 
	// Data :
	//    input == DOM

	var file = input.files[0]; // Upload this file into server using AJAX
	let formData =  new FormData();
	formData.append("action", "uploadovpn");
	formData.append('ovpnfile', file);
	$.ajax({
		url : "/api",
		type : 'POST',
		data : formData,
		processData: false,
		contentType: false,
		enctype: 'multipart/form-data',
		dataType: "JSON",
		success : function(data) {
			if(data.error == null || data.error == ''){
				show_popup(data.msg, 'success');
				get_openvpn_config_list()
			}else{
				show_popup(data.error, 'error');
			}
		}
	});
}

function save_openvpn_settings(config_name, ovpn_username, ovpn_password)
{
	// POST AJAX
	// Saves the openvpn settings
	// Data :
	//    config_name == string
	//    ovpn_username == string
	//    ovpn_password == string (unencrypted)
	if(config_name == "" || config_name == undefined){
		show_popup("Please select openvpn config file.", "error")
	}else if(ovpn_username == "" || ovpn_username == undefined){
		show_popup("Please enter openvpn username.", "error")
		$('#ovpn_username').focus();
	}else if(ovpn_password == "" || ovpn_password == undefined){
		show_popup("Please enter openvpn password.", "error")
		$('#ovpn_password').focus();
	}else{
		$.ajax({
			url : "/api",
			method:"POST",
			data: {action: "saveopenvpnsettings", 
					uname: ovpn_username, 
					pword: ovpn_password,
					config: config_name
			},
			dataType:"JSON",
			success:function(data){
				if(data.error == null || data.error == ""){
					show_popup(data.msg, 'success');
				}else{
					show_popup(data.error, 'error');
				}
			}
		});
	}


}

function save_http_settings(tunnel_type, proxy_host, proxy_port, payload, sni)
{
	// POST AJAX
	// Saves the HTTP settings
	// Data :
	//    tunnel_type == string
	//    proxy_host == string
	//    proxy_port == string 
	//    payload == string (Long text)
	//    sni == string 
	if(tunnel_type == "" || tunnel_type == undefined){
		show_popup("Please select tunnel type.", "error")
	}else if(proxy_host == "" || proxy_host == undefined){
		show_popup("Please enter proxy host.", "error")
	}else if(proxy_port == "" || proxy_port == undefined){
		show_popup("Please enter proxy port.", "error")
	}else{
		if(tunnel_type.toLowerCase() == "http" && (payload == "" || payload == undefined)){
			show_popup("Please enter payload.", "error")
		}else if(tunnel_type.toLowerCase() == "ssl" && (sni == "" || sni == undefined)){
			show_popup("Please enter sni.", "error")
		}else{
			$.ajax({
				url : "/api",
				method:"POST",
				data: {action: "savehttpsettings", 
						tunnel_type: tunnel_type, 
						proxy_host: proxy_host,
						proxy_port: proxy_port, 
						payload: payload,
						sni: sni
				},
				dataType:"JSON",
				success:function(data){
					if(data.error == null || data.error == ""){
						show_popup(data.msg, 'success');
					}else{
						show_popup(data.error, 'error');
					}
				}
			});
		}
	}
}

function clear_ovpn_log() {
	// GET REQUEST AJAX
	// Request to clear OpenVPN Log
	$.ajax({
		url: "/api",
		method: "POST",
		data: {action: "clearovpnlog"},
		dataType:"JSON",
		success:function(data){
			if(data.error == null || data.error == ""){
				show_popup("OpenVPN Logs cleared", 'success');
			}
		}
	});
}

function clear_ssh_log() {
	// GET REQUEST AJAX
	// Request to clear SSH Log

}

function clear_http_log() {
	// GET REQUEST AJAX
	// Request to clear OpenVPN Log
	$.ajax({
		url: "/api",
		method: "POST",
		data: {action: "clearhttplog"},
		dataType:"JSON",
		success:function(data){
			if(data.error == null || data.error == ""){
				show_popup("HTTP Tunnel Logs cleared", 'success');
			}
		}
	});
}



function clear_recon_log() {
	// GET REQUEST AJAX
	// Request to clear Recon Log
	
}


function handleLoginEvent(state, e){
	if(state == 'press'){
		if(e.which == 13){
			loginTunHub();
		}
	}else if(state == 'click'){
		loginTunHub();
	}

}
function connectvpn(){
	$('#connect_btn').addClass('disabled');
	$('.rcd-progress').removeClass('hide');
	$.ajax({
		url: "/api",
		method: "POST",
		data: {action: "connectvpn"},
		dataType:"JSON",
		success:function(data){
			show_popup(data.msg, 'success');
			$('#connect_btn').removeClass('disabled');
			$('.rcd-progress').addClass('hide');
		}
	});
}
function disconnectvpn(){
	$('#disconnect_btn').addClass('disabled');
	$('.rcd-progress').removeClass('hide');
	$.ajax({
		url: "/api",
		method: "POST",
		data: {action: "disconnectvpn"},
		dataType:"JSON",
		success:function(data){
			show_popup(data.msg, 'success');
			$('#disconnect_btn').removeClass('disabled');
			$('.rcd-progress').addClass('hide');
		}
	});
}
function logout(){
	if(confirm("Do you want to logout this page?")){
		$.ajax({
			url: "/api",
			method: "POST",
			data: {action: "logout"},
			dataType:"JSON",
			success:function(data){
				location.href = data.msg
			}
		});
	}
	
}

function loginTunHub(){
	let uname = $('#uname').val();
	let pword = $('#pword').val();
	if(uname != '' && pword == ''){
		$('#pword').focus();
		show_popup('Please enter password.', 'error');
	}else if(uname == '' && pword != ''){
		$('#uname').focus()
		show_popup('Please enter username.', 'error');
	}else{
		$.ajax({
			url: "/",
			method: "POST",
			data: {uname: uname, pword:pword, action: "login"},
			dataType:"JSON",
			success:function(data){
				if(data.error == null || data.error == ""){
					location.href = data.msg;
				}else{
					show_popup(data.error, 'error');
				}
			}
		});
	}
}
function get_initialize_settings_form(){
	$.ajax({
		url: "/api",
		method:"POST",
		data: {"action":"getinitializesettingsform"},
		dataType:"JSON",
		success:function(data){
			initialize_settings_form({
				ovpn_saved_username: data.ovpn_username, // STRING
				ovpn_saved_password: data.ovpn_password, // STRING
				// SSH Initialize default saved settings
				// ssh_host: data.ssh_host, // STRING
				// ssh_port: data.ssh_port, // STRING
				// ssh_username: data.ssh_username, // STRING
				// ssh_password: data.ssh_password, // STRING

				saved_http_proxy: data.proxy_host, // STRING
				saved_http_port: data.proxy_port, // STRING
				saved_payload: data.payload, // STRING
				saved_sni: data.sni, // STRING
				Version: data.Version, // STRING
				ReleaseType: data.ReleaseType, // STRING
				ReleaseDate: data.ReleaseDate, // STRING

			});
			updateDropdowns(data.openvpn_file_list.split("|").filter(e => (e != "")), data.selected_open_vpn_file, data.tunnel_type)
		}
	});
 }




function get_openvpn_credentials(){
	$.ajax({
		url: "/api",
		method:"POST",
		data: {"action":"getopenvpncredentails"},
		dataType:"JSON",
		success:function(data){
			$('#ovpn_username').val(data.ovpn_username);
			$('#ovpn_password').val(data.ovpn_password);
		}
	});
}
function get_http_tunnel_data(){
	$.ajax({
		url: "/api",
		method:"POST",
		data: {"action":"gethttptunneldata"},
		dataType:"JSON",
		success:function(data){
			$('#proxy_host').val(data.proxy_host);
			$('#proxy_port').val(data.proxy_port);
			$('#payload').val(data.payload);
			$('#sni').val(data.sni);
		}
	});
}

function get_openvpn_config_list(){
	$.ajax({
		url: "/api",
		method:"POST",
		data: {"action":"getopenvpnconfiglist"},
		dataType:"JSON",
		success:function(data){
			refreshOvpnDropdown(data.openvpn_file_list.split("|").filter(e => (e != "")), data.selected_open_vpn_file);
			//updateDropdowns(data.openvpn_file_list.split("|").filter(e => (e != "")), data.selected_open_vpn_file, data.tunnel_type)
		}
	});
}
function get_wan_ip(){
	$.ajax({
		url: "/api",
		method:"POST",
		data: {"action":"getwanaddress"},
		success:function(data){
			$('#wan_ip').html(data)
			//updateDropdowns(data.openvpn_file_list.split("|").filter(e => (e != "")), data.selected_open_vpn_file, data.tunnel_type)
		}
	});
}


function register_admin(username, password) {
	// POST AJAX
	// Register new admin from install.html
	// Data :
	//    username == string
	//    password == string (Unencrypted)
	if(username != '' && password == ''){
		$('#pword').focus();
		show_popup('Please enter password.', 'error');
	}else if(username == '' && password != ''){
		$('#uname').focus()
		show_popup('Please enter username.', 'error');
	}else{
		$.ajax({
			url: "/api",
			method: "POST",
			data: {uname: username, pword:password, action: "install"},
			dataType:"JSON",
			success:function(data){
				if(data.error == null || data.error == ""){
					show_popup(data.msg, 'success');
				}else{
					show_popup(data.error, 'error');
				}
			}
		});
	}

}

function uninstall_router()
{
	// POST REQUEST AJAX
	// Uninstall router
	if(confirm('Are you sure to uninstall TunnelHub?')) {
		$.ajax({
			url: "/api",
			method: "POST",
			data: {uname: username, pword:password, action: "uninstall"},
			dataType:"JSON",
			success:function(data){
				
			}
		});
	}
}

// CHECK UPDATE SCRIPT BUT NO DOWNLOAD, JUST CHECK IF UPDATE IS AVAILABLE
function check_update()
{
	//POST AJAX
	//Just check for updates but dont download yet
	$.ajax({
		url:"/api",
		method:"POST",
		data:{"action":"checkupdate"},
		dataType:"JSON",
		success:function(data){
			if(data.error == null || data.error == ""){
				show_new_update_ui({
					version: data.Version,  // The Update version (eg. v1.1)
					label: data.ReleaseType,      // The update label (eg. Alpha, Beta, Stable)
					date: data.ReleaseDate        // The release date of the update (eg. January 01, 2021)
				})
			}else{
				if(data.error.includes("Error found:")){
					show_notice("no-connection"); 
				}else{
					show_notice("no-new-update"); 
				}
				
			}
		}
	});


	//RETURN VALUE HANDLER FUNCTIONS. 


	//!! USE ONLY ONE FUNCTION BELOW !!

	//If new update was detected, fetch the meta data and use this function
	// show_new_update_ui({
	// 	version: UPDATE_VERSION,  // The Update version (eg. v1.1)
	// 	label: UPDATE_LABEL,      // The update label (eg. Alpha, Beta, Stable)
	// 	date: RELEASE_DATE        // The release date of the update (eg. January 01, 2021)
	// })

	// If no update was fetch notify the user by using this function
	// show_notice(error_type); 	  // Possible values: 
	//                          	            "no-new-update" - If the version is at the latest version and dont need an update
	//                          	            "no-connection" - If we can't reach the server
}



function download_and_update()
{
	// POST AJAX Request
	// Request to download the latest version and update the system.

	// Run Downloading Screen Function 
	// @added by Raldin Casidar



	$.ajax({
		url:"/api",
		method:"POST",
		data:{"action":"updateSoftware"},
		dataType:"JSON",
		success:function(data){
			if(data.error == null || data.error == ""){
				// show_notice(data.msg, "success")
				if(data.msg != ""){
					show_popup(data.msg, "success"); 
					show_notice("downloading-update");
				}
			}else{
				// show_notice(data.error, "error")
				show_popup(data.error, "error"); 
				
			}
		},
		error: function(){

		}
	});
}



function process_uploaded_update_file(input)
{
	// POST AJAX
	// Process Upload and Update file
	// After user upload, update the system
	// Requires Special Ajax Configuration (@google) to successfuly upload file. 
	// Data :
	//    input == DOM

	var file = input.files[0]; // Upload this file into server using AJAX

	if(confirm('Are you sure you\'ve selected the correct update? This may cause an unexpected corruption if not done well. To confirm your offline update, click the OK button')) {
	show_notice("downloading-update"); 

	
	// Ajax and Update starts here


	}
}

function save_ssh_settings(ssh_host, ssh_port, ssh_username, ssh_password)
{

	// POST AJAX
	// Saves the SSH settings
	// Data :
	//    ssh_host == string
	//    ssh_port == string
	//    ssh_username == string
	//    ssh_password == string (unencrypted)

}

