/**
 * Routing of pages
 */

import React from 'react'
import { BrowserRouter as BrowserRouterClass, Route, Switch } from 'react-router-dom'
import Intro from './pages/intro'
import About from './pages/about'
import Contact from './pages/contact'
import JobTypes from './pages/job-types'


export default 	() => (<BrowserRouterClass>
	<Switch>
		<Route path="/" exact component={Intro}/>
		<Route path="/#wie-ik-ben" exact component={About}/>
		<Route path="/#contact" exact component={Contact}/>
		<Route path="/#wat-ik-doe" exact component={JobTypes}/>
	</Switch>
</BrowserRouterClass>)