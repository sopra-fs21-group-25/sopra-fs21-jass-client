import React from 'react';
import { Redirect } from 'react-router-dom';

export const MenuGuard = props => {
    return localStorage.getItem('token') ?
        props.children :
        <Redirect to={'/login'} />;
}