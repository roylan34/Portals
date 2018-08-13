<?php
/**
* 01/25/2017
* @credits: Prestashop 15-104 lines.
*
* This file contains a class for utilities.
*
*/
 error_reporting(-1); // 0 = turn off, -1 = turn on

Class Utils{

	static private $appName = "machine";

	static public function isEmpty($field)
	{
		return $field === '' OR $field === NULL;
	}

	/**
	* Sanitize a string
	*/
	static public function safeOutput($string, $html = false)
	{
	 	if (!$html)
			$string = @htmlentities(strip_tags($string), ENT_QUOTES, 'utf-8');
		return $string;
	}

	/**
	* Get a value from $_POST / $_GET
	* if unavailable, take a default value
	*
	* @param string $key Value key
	* @param mixed $defaultValue (optional)
	* @return mixed Value
	*/
	static public function getValue($key, $defaultValue = false)
	{
	 	if (!isset($key) OR empty($key) OR !is_string($key))
			return false;
		$ret = (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $defaultValue));
		if (is_string($ret) === true)
			$ret = urldecode(preg_replace('/((\%5C0+)|(\%00+))/i', '', urlencode($ret)));
		return !is_string($ret)? $ret : stripslashes($ret);
	}

	static public function getIsset($key)
	{
	 	if (!isset($key) OR empty($key) OR !is_string($key))
			return false;
	 	return isset($_POST[$key]) ? true : (isset($_GET[$key]) ? true : false);
	}

	/**
	* Check for HTML field validity (no XSS please !)
	*
	* @param string $html HTML field to validate
	* @return boolean Validity is ok or not
	*/
	static public function isCleanHtml($html)
	{
		$jsEvent = 'onmousedown|onmousemove|onmmouseup|onmouseover|onmouseout|onload|onunload|onfocus|onblur|onchange|onsubmit|ondblclick|onclick|onkeydown|onkeyup|onkeypress|onmouseenter|onmouseleave';
		return (!preg_match('/<[ \t\n]*script/ui', $html) && !preg_match('/<.*('.$jsEvent.')[ \t\n]*=/ui', $html)  && !preg_match('/.*script\:/ui', $html));
	}

	static public function encrypt($text) 
	{ 
		$crypt_key = "@gTSqK82GADBp.1";
	    return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $crypt_key, $text, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)))); 
	} 

	static public function decrypt($text) 
	{ 
		$crypt_key = "@gTSqK82GADBp.1";
	    return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $crypt_key, base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))); 
	}

	static public function jsonEncode($arr)
	{
		header('Content-Type: application/json; charset-utf8');
		if(!is_array($arr))
			return false;
	    return json_encode($arr);
	}

	static public function jsonDecode($arr)
	{
		if(!is_array($arr))
			return false;
	    return json_decode($arr);
	}

	static public function ucFirstLetter($str){
		if(!is_string($str))
			return false;
		return ucwords(strtolower($str));
	}

	static public function upperCase($str){
		if (!is_string($str))
			return false;
		return strtoupper($str);
	}

	static public function getSysDate(){
		date_default_timezone_set('Asia/Manila');
		$info = getdate();
		$date = $info['mday'];
		$month = $info['mon'];
		$year = $info['year'];
		$dat_e = $year."-".$month."-".$date;

		if(!empty($year) && !empty($month) && !empty($date)){
			return $dat_e;
		}else{
			return $dat_e;
		}
	}

	static public function getSysTime(){
		date_default_timezone_set('Asia/Manila');
		$info = getdate();
		$hour = $info['hours'];
		$min = $info['minutes'];
		$sec = $info['seconds'];
		$time = $hour.":".$min.":".$sec;
		if(!empty($hour) && !empty($min) && !empty($sec)){
			return $time;
		}else{
			return $time;
		}
	}

	static public function getBaseUrl() 
	{
	    // output: /myproject/index.php
	    $currentPath = $_SERVER['PHP_SELF']; 
	    
	    // output: Array ( [dirname] => /myproject [basename] => index.php [extension] => php [filename] => index ) 
	    $pathInfo = pathinfo($currentPath); 
	    
	    // output: localhost
	    $hostName = $_SERVER['HTTP_HOST']; 
	    
	    // output: http://
	    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https://'?'https://':'http://';
	    
	    // return: http://localhost/myproject/
	    return $protocol.$hostName.$pathInfo['dirname']."/";
	}

	static public function getImagePath($dirImage) 
	{
	    // output: /myproject/index.php
	    $currentPath = $_SERVER['PHP_SELF']; 
	    
	    // output: localhost
	    $hostName = $_SERVER['HTTP_HOST']; 
	    
	    // output: http://
	    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https://'?'https://':'http://';
	   
	    // return: http://localhost/myproject/
	     return $protocol.$hostName."/".self::$appName."/assets/attachment/".$dirImage;
	}

	static public function getImages($dirImage){
		 $tmp_dir =  $_SERVER['DOCUMENT_ROOT'].'/'.self::$appName.'/assets/attachment/'.$dirImage; //Get the relative path.
		 $imgPath = self::getImagePath($dirImage);
         $array_files = array();
         
         // $files = array_slice(scandir($tmp_dir),2); //Scan only 1 level directory from $tmp_dir with DESCENDING ORDER = 1.
         if(file_exists($tmp_dir)){ //Check if filename exist.
	         $files = scandir($tmp_dir);
	         $scan_files = array_slice($files,2);
		         foreach ($scan_files as $key => $value) {
		         	$array_files[$key]['imagename'] = $value;
		         	$array_files[$key]['imagepath'] = $imgPath.'/'.rawurlencode($value);
		         }
	    }
     	
         return $array_files;
	}
	static public function getImageServerPath($dirImage){
		return $_SERVER['DOCUMENT_ROOT'].'/'.self::$appName.'/assets/attachment/'.$dirImage;
	} 
}

