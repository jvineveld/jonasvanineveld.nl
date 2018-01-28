<?php
/**
 * Initialize website
 * @author Jonas van Ineveld
 */
 
require_once('config.php');
require_once('build/build.site.php');
require_once('build/build.mailer.php');
require_once('build/build.methods.php');

$site = new site();
