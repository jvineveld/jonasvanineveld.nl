import React from 'react'
import Button from './button'

class Menu extends React.Component {

	render(){ return (
		<div className="menu">
			<Button url="/#wie-ik-ben">Wie ik ben</Button>
			<Button url="/#contact">Hoe je me kunt bereiken</Button>
			<Button url="/#wat-ik-doe">Wat ik doe</Button>
		</div>
	)}
}

export default (Menu)
