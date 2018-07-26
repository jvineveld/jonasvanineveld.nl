import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class Button extends Component {
	state = {
		redirect: '',
		classnames: ['button']
	}

	constructor(props) {
		super(props)
		this.button = React.createRef()
	}

	classControl = (name, remove) => {
		let { classnames } = this.state

		if(remove){
			this.setState({
				classnames:  classnames.filter((class_name) => name === class_name)
			})
		}
		else
		{
			this.setState({
				className: [...classnames, name]
			})
		}		
	}

	initStyle = (style) => {
		switch(style){
		case 'default':
		default:
			this.classControl('default')
			break
		}
	}

	componentDidMount() {
		let { style } = this.props

		if(style)
			this.initStyle(style)
	}

	onClick = () => {
		let { url } = this.props
		
		this.setState({
			redirect: (<Redirect to={{
				pathname: url
			}}/>)
		})
	}

	render() {
		let {redirect} = this.state
		let { classnames } = this.state

		return (
			<button type="button" className={classnames.join(' ')} ref={this.button} onClick={this.onClick}>
				{this.props.children} {redirect}
			</button>
		)
	}
}

Button.defaultProps = {
	style: 'default'
}

export default Button