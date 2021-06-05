<?php
	/*
	 * FAKE LOGIN API
	 * Only use this for local testing! Any user has access to all worlds!
	 * Replace by the functions of your account system or implement is_loggedin as return false
	*/
	function get_username(){
		return "user";
	}
	function is_loggedin(){
		return true;
	} 
?>
