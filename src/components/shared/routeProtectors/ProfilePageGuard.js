import React from 'react';
import { Redirect } from 'react-router-dom';
import {UserType} from "../models/UserType";

export const ProfilePageGuard = props => {
    let user = JSON.parse(sessionStorage.getItem('user'));

    return user.userType === UserType.REGISTERED ?
        props.children :
        <Redirect to={'/menu'} />;
}