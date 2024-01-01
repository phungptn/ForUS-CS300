import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {downloadImage} from '../../../utils/loadImage';
export function UserCardSearch  ({ user }) {
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + user.avatarUrl);
            console.log(url);
            setProfilePicture(url);





        }
        getProfilePicture();
    }, []);
  return (
    <div className='rounded-4 card-style p-4 my-4'>
        <div className='row'>
            <div className='col-md-2'>
                <img className='rounded-circle centered-and-cropped' src={
                    profilePicture ? profilePicture : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' } alt='profile' width='100px' height='100px' />
            </div>
            <div className='col-md-8 text-start'>
                <a href={`/user/${user._id}`} className='fs-4 link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>{user.username}</a>
                <h4 className='mt-2'>{user.fullname}</h4>
            </div>
            <div className='col-md-2'>
                <a href={`/user/${user._id}`} className='btn btn-primary'>View Profile</a>
        </div>
                
        </div>

    </div>

  );
};