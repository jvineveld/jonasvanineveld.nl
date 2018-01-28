<?php
/**
 * Handy methods in templates
 * @author Jonas van Ineveld
 */

/**
 * JS fiddle custom embed function
 * For a-sync loading, and code view support
 */
function jsfiddle($name, $fiddle_id, $version, $height){
	?>
	<div class="demo-fiddle loading" data-id="<?php echo $fiddle_id; ?>" data-version="<?php echo $version; ?>" data-height="<?php echo $height; ?>">
		<div class="fiddle-head">
			<span class="fiddle-name"><?php echo $name; ?></span>
		</div>

		<div class="frame-wrapper" style="height:<?php echo $height; ?>px;"></div>
	</div>
	<?php
}
