import React from 'react'
import Button from './button'
import Logo from '../logo.svg'

class Header extends React.Component {

	render(){ return (
		<div className="header">
			header
			<Button url="/" style="blank">
				<img src={Logo} alt="<Jonas/>" width="317" height="56"/>
			</Button>
		</div>
	)}
}

export default (Header)
