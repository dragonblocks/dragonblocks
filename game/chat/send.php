<?php
	if(file_exists("../login-config.php"))
		require("../login-config.php");
	else if(file_exists("../../login-config.php"))
		require("../../login-config.php");
	else
		die;
	if(! is_loggedin())
		die;
	$rawmsg = $_POST["msg"];
	if($rawmsg[0] != ".")
		$rawmsg = ".tell " . $rawmsg;
	$args = explode(" ", $rawmsg);
	switch(array_shift($args)){
		case ".join":
			$msg = get_username() . " has joined.";
			break;
		case ".tell":
			$msg = "<" . get_username() . "> " . join(" ", $args);
			break;
		case ".leave":
			$msg = get_username() . " has left.";
			break;
		case ".me":
			$msg = "*" . get_username() . " " . join(" ", $args);
			break;
	}
	if($msg)
		file_put_contents("message.html", htmlentities($msg));
?>
