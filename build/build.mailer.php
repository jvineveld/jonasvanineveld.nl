<?php
/**
 * mailing class used for website
 * @author Jonas van Ineveld
 */
class mailer extends site{
	public $mail_send;
	public $notice;
	private $to_adress;
	private $mail_template;

	public function __construct(){
		global $site;

		$this->to_adress = EMAIL_ADRESS;
		$this->mail_send = false;
		$this->notice = '';
		$this->mail_template = file_get_contents(__DIR__.'/../templates/mail.phtml');

		if(empty($_POST)) // if no postdata, stop here
			return;

		$this->check_for_bs(); // check if hidden field is filled

		if($this->devmode) // on dev env send a succes without email
			$this->mail_success();
		else
			$this->sendPostMail();
	}

	private function check_for_bs(){
		if(!empty($_POST['company']))
		{
			$this->return_error('hmm.. i think you\'re a robot.. Mail did not send.');
			return true;
		}
		return false;
	}

	private function replace_template_contents($fields){
		$email = $this->mail_template;

		foreach($fields as $field)
		{
			$email = str_replace($field['tag'], $field['content'], $email);
		}

		return $email;
	}

	public function mail_error($msg){
		$this->notice = $msg;
		$this->mail_send = 'error';
	}

	public function mail_success($msg){
		$this->notice = $msg;
		$this->mail_send = 'succes';
	}

	public function sendPostMail(){
		$name = htmlentities($_POST['name']);
		$email = htmlentities($_POST['email']);
		$message = htmlentities($_POST['message']);
		$location = htmlentities($_POST['location']);

		if(empty($name) || empty($email) || empty($message) || empty($location))
		{
			$this->mail_error('Not all required fields where filled. For this reason the message did not send. Please try again.');
			return;
		}

		$email_content = $this->replace_template_contents([
			'{{name}}' => $name,
			'{{email}}' => $email,
			'{{message}}' => $message,
			'{{location}}' => $location
		]);

		$this-send_mail($email_content);
	}

	public function send_mail($content, $subject = false){
		if(empty($content))
			return;

		// Set headers
		//------------------------------------------------------------------------------
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers .= 'From: <jonas@makeityourown.nl>' . "\r\n";

		$subject = $subject ?: "jonasvanineveld.nl contact";

		if(mail($to_adress,$subject,$content,$headers))
		{
			$this->mail_success('Thanks for contacting me!');
		}
		else
		{
			$this->mail_error('Something went wrong sending email.. Please try again later');
		}
	}
}
