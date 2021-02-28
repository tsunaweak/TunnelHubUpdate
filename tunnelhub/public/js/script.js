// Particle.js Configuration
// @url https://vincentgarreau.com/particles.js/

particlesJS("particles-js", {"particles":{"number":{"value":20,"density":{"enable":true,"value_area":500}},"color":{"value":"#616161"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#616161","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});

// Javascript History API (To change URL)
window.onpopstate = function(event) {
  void(0);
}




// Load All Document First
window.onload = function(){
	// Run Check for URL
	$.get('/dashboard', function(data, status){
		console.log(status);
		setTimeout(function(){
			check_for_url();
			$('.rcd-progress').addClass('hide');
		}, refresh_rate_);
	});

}


// Jquery Ready

$( () => {

	// Initialize Materialize Sidenav
	$('.sidenav').sidenav();

	// RCD Navigation
	$(document).on("click","[rcd-navigate]", function (e) {

	   var page = $(this).attr('rcd-navigate').slice(0,-5);

	   rcd_navigate(page);

   	   e.preventDefault();
       e.stopPropagation();
	});




	// Form Click to Check
	$('.rcd-form-checkbox').click(e=>{
		if ($('#inject_status').attr('checked') == "checked") {
			$('#inject_status').removeAttr('checked');
		}
		else
		{
			$('#inject_status').attr('checked', 'checked');
		}

		//inject_status();
	});

	$('.rcd-form-checkbox-recon').click(e=>{
		if ($('#recon_status').attr('checked') == "checked") {
			$('#recon_status').removeAttr('checked');
		}
		else
		{
			$('#recon_status').attr('checked', 'checked');
		}

		//inject_status();
	});



	// Initialize Materialize Select
	$('select').formSelect({
		coverTrigger: false	
	});

	$('select[name="tunnel_type"]').change(e=>{
		update_http_form();
	});


	// Initialize Materialize Tabs
	$('.tabs').tabs();

	// Initialize Sidenav
	$('.sidenav').sidenav();

	// Initialize Modal
	$('.modal').modal();


	// Overscroll Tab

 
	// Install.html Animations

	setTimeout(function(){
			$('.rcd-install-message.one').fadeIn(1000, function(){
		    setTimeout(function(){
		      $('.rcd-install-message.one').fadeOut(500, rcd_two);
		    }, 2000);
		  });
		}, 1500);


	// Istall.html JS Validation
	$('.new-acc').keyup(function(){

	  var username = $('#username').val();
	  var password = $('#password').val();
	  var password_retype = $('#password_retype').val();

	  if (username != "" && password != "" && password == password_retype) {
	    $('.finish-install').removeAttr('disabled');
	  }
	  else
	  {
	    $('.finish-install').attr('disabled', '');
	  }

	});

	// check_for_url();
	load_defaults(); 
	
});
// END JQUERY

// Navigate Page Function
function rcd_navigate(page)
{
	   var page_dom_class = '.' + page + "-page";

	    if (page != "#!" || page != "#" || page != "") {
	    	topFunction();
	    	$('.rcd-page').animate({
	    		'margin-top': '30px',
	    		'opacity': 0
	    	}, {
	    		duration: 100,
	    		complete: function(){
	    			$('.rcd-page').removeClass('active');
	    			$('.rcd-page'+page_dom_class).addClass('active');
	    			history.pushState({page: capitalizeFirstLetter(page)}, capitalizeFirstLetter(page), "?page="+page);
	    			document.title = "TunnelHub - " + capitalizeFirstLetter(page);
	    			$('.rcd-logo').text(page);
	    			if (page == "dashboard") {
	    				$('.sidenav-trigger').removeClass('hide');
	    				$('.rcd-back-button').addClass('hide');
	    			}
	    			else
	    			{
						
	    				$('.sidenav-trigger').addClass('hide');
	    				$('.rcd-back-button').removeClass('hide');
	    			}

	    			if (page == "logs") {
	    				$('.tabs').tabs('updateTabIndicator');
	    			}

	    			if (page == "settings") {
	    				$('.tabs').tabs('updateTabIndicator');
	    			}

	    			if (page == "logs") {
	    				$('.log-btn').addClass('hide');
	    			}
	    			else
	    			{
	    				$('.log-btn').removeClass('hide');
	    			}
	    			$('.rcd-page').animate({
			    		'margin-top': '0',
			    		'opacity': 1
			    	}, 50);
	    		}
	    	});

	    }


}
function load_defaults(){
	get_initialize_settings_form();
}


// Get Requested URL and load Page
function check_for_url(){

	url_string = window.location.href;
	var url = new URL(url_string);
	var c = url.searchParams.get("page");
	if (c && c != "dashboard") {
		rcd_navigate(c)
	}
	else{
		rcd_navigate('dashboard');
	}
}

// Capitalize First Letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

setInterval(function(){
	let url = document.URL;
	if (url.includes("dashboard")){
		var textarea1 = document.getElementById('ovpn_textarea');
		textarea1.scrollTop = textarea1.scrollHeight;
		var textarea = document.getElementById('http_textarea');
		textarea.scrollTop = textarea.scrollHeight;
	}
},refresh_rate_);

// Bytes to kilobytes to GB Converter
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

	const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Global Variable for IntervalDataUpdate()
var recent_status; 

function IntervalDataUpdate(data){




	//  THE REAL SCRIPT IS HERE

	$('#wan_ip').text(data.wan_ip);
	$('#vpn_ip').text(data.vpn_ip);
	$('#upload_rate').text(formatBytes(Number(data.upload_rate)));
	$('#download_rate').text(formatBytes(Number(data.download_rate)));
	// $('#vpn_status').text(data.vpn_status); // MOVED .. Executed once all if else are completed
	$('#inject_status').prop('checked', (data.inject_status == "1"))
	$('#recon_status').prop('checked', (data.reconnect_status == "1"))

	var current_data = data.vpn_status.toUpperCase();
	// Check if recent_status has a value or not (recent_status does not have value at first load)
	if (recent_status != null || recent_status != undefined) {

		// Check if current_data is same as recent_status if not then fade and change the display, else stay the dispplay
		if (current_data != recent_status) {
			$('.statistics-page').animate({opacity: 0}, 100, null, function(){
					$('#vpn_status').text(data.vpn_status);
					change_dashboard_display();
				recent_status = current_data;
				setTimeout(function(){
					$('.statistics-page').animate({opacity: 1}, 100);
				},50);
			});
		}
		else
		{
			$('#vpn_status').text(data.vpn_status);
		}
	}
	else
	{
		$('#vpn_status').text(data.vpn_status);
		change_dashboard_display();
		recent_status = current_data;
	}




	// DEFINED FUNCTION INSIDE A FUNCTION THAT CHANGES THE DASHBOARD DISPLAY INDICATOR IF CONNECTED OR NOT

	function change_dashboard_display()
	{
		
		if (data.vpn_status.toUpperCase() == "CONNECTED") {
			$('#vpn_status_icon').text('verified_user');
			$('#vpn_status_icon').addClass('rcd-green-text');
			$('#vpn_status_icon').removeClass('rcd-red-text');
			$('#vpn_status_icon').removeClass('rcd-connecting');
			$('#connect_btn').addClass('hide');
			$('#disconnect_btn').removeClass('hide');
			$('.rcd-show-only-on-connected').removeClass('rcd-hide');
			buttons_mode('disable');
		}
		else if (data.vpn_status.toUpperCase() == "CONNECTING")
		{
			$('#vpn_status_icon').text('hourglass_bottom');
			$('#vpn_status_icon').addClass('rcd-connecting');
			$('#vpn_status_icon').removeClass('rcd-green-text');
			$('#vpn_status_icon').removeClass('rcd-red-text');
			$('#connect_btn').addClass('hide');
			$('#disconnect_btn').removeClass('hide');
			$('.rcd-show-only-on-connected').addClass('rcd-hide');
			buttons_mode('disable');
		} 
		else
		{
			$('#vpn_status_icon').text('power_settings_new');
			$('#vpn_status_icon').removeClass('rcd-connecting');
			$('#vpn_status_icon').removeClass('rcd-green-text');
			$('#vpn_status_icon').addClass('rcd-red-text');
			$('#connect_btn').removeClass('hide');
			$('#disconnect_btn').addClass('hide');
			$('.rcd-show-only-on-connected').addClass('rcd-hide');
			buttons_mode('enable');
		}
	}
}




function initialize_settings_form(data)
{
	$('#ovpn_username').val(data.ovpn_saved_username);
	$('#ovpn_password').val(data.ovpn_saved_password);
	$('#ssh_host').val(data.ssh_host);
	$('#ssh_port').val(data.ssh_port);
	$('#ssh_username').val(data.ssh_username);
	$('#ssh_password').val(data.ssh_password);
	$('#proxy_host').val(data.saved_http_proxy);
	$('#proxy_port').val(data.saved_http_port);
	$('#payload').val(data.saved_payload);
	$('#sni').val(data.saved_sni);
	$('#lblVersion').html(data.Version);
	$('#lblType').html(data.ReleaseType);
	$('#lblVerDate').html(data.ReleaseDate);
}

function inject_status()
{
	save_inject_vpn_with_http($('#inject_status').is(':checked'));
}

function recon_status()
{
	save_recon_input($('#recon_status').is(':checked'));
}

function copyText(selector)
{
	if ($(selector).val() != "") {
		var copyText = document.querySelector(selector);
		copyText.select();
		copyText.setSelectionRange(0, 99999); /* For mobile devices */
		document.execCommand("copy");
		copyText.setSelectionRange(0, 0);

		
		if (selector == '#ovpn_textarea'){
			show_popup("OpenVPN Logs saved to clipboard", "success");
		}
		if (selector == '#http_textarea'){
			show_popup("HTTP Tunnel Logs saved to clipboard", "success");
		}
		if (selector == '#recon_textarea'){
			show_popup("Auto-Recon Logs saved to clipboard", "success");
		}
		
	}
}

function show_popup(message, type)
{
	var color;

	if (type == "success") {
		color = 'green darken-1';
	}
	if (type == "warning") {
		color = 'orange darken-1';
	}
	if (type == "error") {
		color = 'red darken-1';
	}

	M.toast({html: message, classes: color, displayLength: 1500});
}

function update_http_form()
{

	if ($('select[name="tunnel_type"]').val() == "http") {
		$('.http-payload').removeClass('hide');
		$('.ssl-payload').addClass('hide');
		$('.http-proxy-port').removeClass('hide');
	}
	else
	{
		$('.http-payload').addClass('hide');
		$('.ssl-payload').removeClass('hide');
		$('.http-proxy-port').addClass('hide');
	}
}

function updateDropdowns(openvpn_file_list, open_vpn_file_selected, tunnel_type_selected)
{

	// Construct HTML Options first for openvpn dropdown list
	var array_openvpn_file_list = [];
	for (var i = openvpn_file_list.length - 1; i >= 0; i--) {
		array_openvpn_file_list.push('<option value="'+openvpn_file_list[i]+'">'+openvpn_file_list[i]+'</option>')
	}
	var html_openvpn_file_list = array_openvpn_file_list.join("\n");

	// PUT Config first
	var sc_elem = $('#selected_config');
	var sc_instance = M.FormSelect.getInstance(sc_elem);
	sc_instance.el.innerHTML += html_openvpn_file_list;
	$(sc_elem).formSelect();
	sc_instance.el.value = open_vpn_file_selected;
	sc_instance.input.value = open_vpn_file_selected;
	$(sc_elem).formSelect();


	// Update Tunnel type Dropdown
	var tt_elem = $('#tunnel_type');
	var tt_instance = M.FormSelect.getInstance(tt_elem);
	tt_instance.el.value = tunnel_type_selected;
	tt_instance.input.value = tunnel_type_selected.toUpperCase();

	update_http_form();

}

function refreshOvpnDropdown(openvpn_file_list, open_vpn_file_selected)
{
	// Construct HTML Options first for openvpn dropdown list
	var array_openvpn_file_list = [];
	for (var i = openvpn_file_list.length - 1; i >= 0; i--) {
		array_openvpn_file_list.push('<option value="'+openvpn_file_list[i]+'">'+openvpn_file_list[i]+'</option>')
	}
	var html_openvpn_file_list = array_openvpn_file_list.join("\n");

	// PUT Config first
	var sc_elem = $('#selected_config');
	var sc_instance = M.FormSelect.getInstance(sc_elem);
	sc_instance.el.innerHTML = html_openvpn_file_list;
	$(sc_elem).formSelect();

	sc_instance.el.value = open_vpn_file_selected;
	sc_instance.input.value = open_vpn_file_selected;
	$(sc_elem).formSelect();
	
}

// Install.html Functions

function rcd_two(){
  $('.rcd-install-message.two').fadeIn(1000, function(){
    setTimeout(function(){
      $('.rcd-install-message.two').fadeOut(500, rcd_three);
    }, 2000);
  });
}
function rcd_three(){
  $('.rcd-install-message.three').fadeIn(1000, function(){
    setTimeout(function(){
      $('.rcd-install-message.three').fadeOut(500, rcd_four);
    }, 2000);
  });
}
function rcd_four(){
  $('.rcd-install-message.four').fadeIn(1000, function(){
    setTimeout(function(){
      $('.rcd-install-message.four').fadeOut(500, rcd_five);
    }, 2000);
  });
}
function rcd_five(){
  $('.rcd-install-message.five').fadeIn(1000, ralds);
}
function rcd_six()
{
  $('.rcd-install-message.six').fadeIn(1000);
}


function ralds()
{
	setTimeout(function(){
		$('.rcd-login-title').text('TunnelHub Admin Setup');
		$('.rcd-forms').animate({'height': '340'});
	},2500);
}

function finish_inst()
{
  $('.rcd-install-message.five').fadeOut(500, rcd_six);

  var username = $('#username').val();
  var password = $('#password').val();
  register_admin(username, password);
}



function buttons_mode(mode) {
	if (mode == 'disable') {
		$('#inject_status').prop('disabled', true);
		$('#recon_status').prop('disabled', true);
		$('#selected_config').prop('disabled',true);
		$('#tunnel_type').prop('disabled',true);
		$('#ovpn_username').prop('disabled',true);
		$('#ovpn_password').prop('disabled',true);
		$('#ssh_host').prop('disabled',true);
		$('#ssh_port').prop('disabled',true);
		$('#ssh_username').prop('disabled',true);
		$('#ssh_password').prop('disabled',true);
		$('#ovpn_save').prop('disabled',true);
		$('#proxy_host').prop('disabled',true);
		$('#proxy_port').prop('disabled',true);
		$('#payload').prop('disabled',true);
		$('#sni').prop('disabled',true);
		$('#save_ovpn').prop('disabled',true);
		$('#save_ssh').prop('disabled',true);
		$('#save_http').prop('disabled',true);

		// AddClass Disable
		$('#delete_ovpn_btnx').addClass('disabled', '');
		$('#upload_ovpn_btnx').addClass('disabled', '');
		$('#ovpn_username').addClass('disabled', '');
		$('#ovpn_password').addClass('disabled', '');

		// Refresh dropdowns
		$('#selected_config').formSelect();
		$('#tunnel_type').formSelect();

	}
	else if (mode == 'enable')
	{
		$('#inject_status').prop('disabled', false);
		$('#recon_status').prop('disabled', false);
		$('#selected_config').prop('disabled',false);
		$('#tunnel_type').prop('disabled',false);
		$('#ovpn_username').prop('disabled',false);
		$('#ovpn_password').prop('disabled',false);
		$('#ssh_host').prop('disabled',false);
		$('#ssh_port').prop('disabled',false);
		$('#ssh_username').prop('disabled',false);
		$('#ssh_password').prop('disabled',false);
		$('#ovpn_save').prop('disabled',false);
		$('#proxy_host').prop('disabled',false);
		$('#proxy_port').prop('disabled',false);
		$('#payload').prop('disabled',false);
		$('#sni').prop('disabled',false);
		$('#save_ovpn').prop('disabled',false);
		$('#save_ssh').prop('disabled',false);
		$('#save_http').prop('disabled',false);

		// AddClass Disable
		$('#delete_ovpn_btnx').removeClass('disabled');
		$('#upload_ovpn_btnx').removeClass('disabled');
		$('#ovpn_username').removeClass('disabled');
		$('#ovpn_password').removeClass('disabled');

		// Refresh dropdowns
		$('#selected_config').formSelect();
		$('#tunnel_type').formSelect();
	}
}

function script_check_update()
{
	$('.rcd-update-divs').fadeOut(200, function(){
		$('.check-update-ui').fadeIn(200);
	});
	

	check_update();
}

function show_new_update_ui(data)
{
	$('.rcd-update-divs').fadeOut(200, function(){
		$('.new_update_v').text(data.version);
		$('.new_update_label').text(data.label);
		$('.new_update_date').text(data.date);
		$('.rcd-new-update').fadeIn(200);
	});
}

function show_notice(error_type)
{
	$('.rcd-update-divs').fadeOut(200, function(){

		if (error_type == "no-new-update") { // This means that the software is already up to date and no need update
			notice = '<a class="btn btn-flat btn-small rcd-green btn-flat white-text" style="border-bottom: 0"><i class="material-icons left">check</i>You\'re at the latest version! </a>';
		}

		else if(error_type == "no-connection") { // Can't reach the server
			notice = '<a class="btn btn-flat btn-small rcd-red btn-flat white-text" style="border-bottom: 0"><i class="material-icons left">perm_scan_wifi</i>Can\'nt reach the server. Check your connection </a> <br><br> <a href="#!" onclick="script_check_update()">Try Again</a>';
		}

		else if(error_type == "downloading-update") {
			$('.rcd-update-divs').fadeOut(200, function(){
				$('.download-update-ui').fadeIn(200);
			});
		}

		else if(error_type == "rebooting-update") { // Can't reach the server
			notice = '<a class="btn btn-flat btn-small rcd-red btn-flat white-text" 	style="border-bottom: 0"><i class="material-icons left">router</i>Rebooting final update. Please reconnect...</a> <br><br> <a href="#!" onclick="script_check_update()">Try Again</a>';
		}
		if (error_type != "downloading-update") {
			
			$('.insert-notice-update-here').html(notice);

			$('.rcd-latest-version-ui').fadeIn(200);
		}
	});
}

// Scroll to top

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}