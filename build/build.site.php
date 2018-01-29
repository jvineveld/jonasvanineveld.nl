<?php
/**
 * Small site manager class
 * @author Jonas van Ineveld
 *
 * This is to minimize code duplication and be a bit more efficient with my code
 * - 404 pages support
 * - template support
 * - easy svg / css embed support
 */
class site{
	public $devmode;
	public $page;
	public $mailer;
	private $page_path;

	public function __construct(){
		$this->set_page();
		$this->set_page_path();
		$this->check_404();

		$this->devmode = preg_match('/\.test/', $_SERVER['HTTP_HOST'])==1 ? true : false;

		$this->mailer = new mailer();
	}

	private function check_404(){
		if($this->get_page_content_file()==false)
		{
			http_response_code(404);
			require_once('404.php');
			die();
		}
	}

	public function google_analytics(){
		if(!$this->devmode) { ?>
			<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo GTAG_ID; ?>"></script>
			<script>
		  		window.dataLayer = window.dataLayer || [];
		  		function gtag(){dataLayer.push(arguments);}
		  		gtag('js', new Date());
				gtag('config', '<?php echo GTAG_ID; ?>');
			</script>
		<?php } else { ?>
			<!-- no tracking urls on dev env -->
			<script> function gtag(a1,a2,a3){ console.info('GA tracking', a3); /* to prevent js errors on dev, and for verification */ } </script>
		<?php }
	}

	public function set_page(){
		if(defined('ALTERNATE_PAGE'))
		{
			$page = ALTERNATE_PAGE;
			return;
		}

		$this->page = $_SERVER['REQUEST_URI'] == '/' ? 'frontpage' : $_SERVER['REQUEST_URI'];
	}

	public function get_svg($name)
	{
		$imgPath = __DIR__.'/../resources/images/'.$name.'.svg';

		if(file_exists($imgPath))
			return file_get_contents($imgPath);
	}

	public function get_css($name = false)
	{
		$style = $_SERVER['REQUEST_URI'] == '/' || defined('ALTERNATE_PAGE') ? 'frontpage' : 'style';
		$style = $name ? $name : $style;

		$cssPath = __DIR__.'/../resources/css/'.$style.'.css';
		$relPath = '/resources/css/'.$style.'.css';

		if($this->devmode)
			echo '<!-- Loading css: '.$cssPath.' -->';

		if(file_exists($cssPath))
		{
			if($this->devmode)
				return sprintf("<link id='style-%s' rel='stylesheet' href='%s'>",$style, $relPath);
			else
				return sprintf("<style id='style-%s'>\n%s</style>",$style, file_get_contents($cssPath));
		}
	}

	public function print_header(){
		$page_path = $this->page_path;
		$file = $page_path.'head.phtml';

		if(file_exists($file))
			require_once($file);
		else
			return false;

		return true;
	}

	public function print_footer(){
		$page_path = $this->page_path;
		$file = $page_path.'foot.phtml';

		if(file_exists($file))
			require_once($file);
		else
			return false;

		return true;
	}

	public function get_template($filename)
	{
		$template_dir = __DIR__.'/../templates/';
		$file = $template_dir.$filename.'.phtml';

		if(file_exists($file))
			include($file);
		else
			return false;

		return true;
	}

	public function set_page_path($page = false){
		$page = $page ? $page : $this->page;

		$template_dir = __DIR__.'/../pages/'.$page.'/';
		$dir = is_dir($template_dir) ? $template_dir : false;

		if(!$dir) // also check in development folder
		{
			$template_dir = __DIR__.'/../pages/in-dev/'.$page.'/';
			$dir = is_dir($template_dir) ? $template_dir : false;
		}

		$this->page_path = $dir;
	}

	public function get_page_content_file($page = false, $get_content = false){
		$page_path = $this->page_path;
		$file = $page_path.'index.phtml';

		if(file_exists($file) && !$get_content)
			return file_get_contents($file);
		else
			return file_exists($file);
	}

	public function print_page_contents($page = false){
		$page_path = $this->page_path;
		$file = $page_path.'index.phtml';

		if(file_exists($file))
			require_once($file);
		else
			return false;

		return true;
	}
}
