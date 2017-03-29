import React from 'react'

const Link = ({active, children, handleTabClick}) => {
	return active ? 
		<strong>{children}</strong> : 
		<a href="javascript:void(0)" 
			onClick={handleTabClick}>{children}
		</a>
}

export default Link