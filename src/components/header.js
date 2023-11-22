import React from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from './button'

    const Header = ({ title, onAdd, showAddBtn }) => {
        const location = useLocation();
    return (
        <header className='header'>
        <h1>{title}</h1>
        {  location.pathname === '/' && showAddBtn ? <Button color='red' text='Close' onClick={onAdd}/> 
        :
        location.pathname === '/' &&  <Button color='black' text='Add' onClick={onAdd}/>}
        </header>
    )
}

    Header.defaultProps = {
        title : 'Todo App'
    }
    Header.propTypes = {
        title: PropTypes.string.isRequired
    }

export default Header